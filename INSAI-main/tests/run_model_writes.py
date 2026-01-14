import mysql.connector
import os
import traceback

MYSQL_PARAMS = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'insai_poa'
}

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'model')
MODEL_DIR = os.path.abspath(MODEL_DIR)

results = []

cnx = mysql.connector.connect(**MYSQL_PARAMS)
cur = cnx.cursor()

# get tables
cur.execute('SHOW TABLES')
all_tables = set([r[0] for r in cur.fetchall()])

py_files = [f for f in os.listdir(MODEL_DIR) if f.endswith('.py')]

# helper to find candidate table name
def candidates_from_filename(name):
    base = name[:-3]
    candidates = []
    # remove common suffixes
    for sfx in ['_model', '_modelo']:
        if base.endswith(sfx):
            base2 = base[:-len(sfx)]
            candidates.append(base2)
    candidates.append(base)
    # plural/singular tries
    if not base.endswith('s'):
        candidates.append(base + 's')
    else:
        candidates.append(base.rstrip('s'))
    candidates.append(base + '_data')
    candidates.append(base + 'es')
    # some manual corrections
    if base == 'seguidad_model':
        candidates.append('seguridad')
    return [c for c in candidates]

for py in py_files:
    fname = os.path.join(MODEL_DIR, py)
    name = py
    cand = candidates_from_filename(name)
    table = None
    for c in cand:
        if c in all_tables:
            table = c
            break
    if table is None:
        results.append((py, 'SKIP', 'No matching table found among candidates: ' + ','.join(cand)))
        continue

    # inspect columns
    try:
        cur.execute("SELECT COLUMN_NAME, DATA_TYPE, EXTRA, COLUMN_KEY FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s", (MYSQL_PARAMS['database'], table))
        cols_info = cur.fetchall()
        if not cols_info:
            results.append((py, 'FAIL', f'No column info for table {table}'))
            continue
        # choose up to 3 columns that are not auto_increment and not primary key if possible
        insert_cols = []
        pk_col = None
        for col, dtype, extra, ckey in cols_info:
            if ckey == 'PRI' and pk_col is None:
                pk_col = col
            if 'auto_increment' in (extra or ''):
                continue
            # skip timestamp or columns named updated_at created_at
            if col.lower() in ('created_at','updated_at'):
                continue
            insert_cols.append((col, dtype))
            if len(insert_cols) >= 3:
                break
        if not insert_cols:
            results.append((py, 'SKIP', f'No suitable insertable columns for table {table}'))
            continue
        # prepare values
        vals = []
        for col, dtype in insert_cols:
            if dtype in ('int','bigint','smallint','mediumint','tinyint'):
                vals.append(1)
            elif dtype in ('float','double','decimal'):
                vals.append(1.0)
            elif dtype in ('date',):
                vals.append('2025-10-13')
            else:
                vals.append('test')
        cols_sql = ','.join([f'`{c}`' for c, _ in insert_cols])
        placeholders = ','.join(['%s'] * len(vals))
        insert_sql = f'INSERT INTO `{table}` ({cols_sql}) VALUES ({placeholders})'
        try:
            cur.execute(insert_sql, tuple(vals))
            cnx.commit()
            last_id = cur.lastrowid
            # try to find pk column
            if pk_col is None:
                # fallback: try id or id_{table}
                for trycol in ('id','id_'+table.rstrip('s')):
                    for ci in cols_info:
                        if ci[0] == trycol:
                            pk_col = trycol
                            break
                    if pk_col:
                        break
            if pk_col:
                # update first text column to indicate update
                upd_col = insert_cols[0][0]
                upd_sql = f"UPDATE `{table}` SET `{upd_col}` = %s WHERE `{pk_col}` = %s"
                try:
                    cur.execute(upd_sql, ('test_upd', last_id))
                    cnx.commit()
                    results.append((py, 'OK', f'Inserted id={last_id} into {table}, updated {upd_col}'))
                except Exception as e:
                    results.append((py, 'PARTIAL', f'Inserted id={last_id} but update failed: {e}'))
            else:
                results.append((py, 'OK', f'Inserted id={last_id} into {table}, no pk detected for update'))
        except Exception as e:
            # insertion failed
            results.append((py, 'FAIL', f'Insert failed for table {table}: {e}'))
    except Exception as e:
        results.append((py, 'ERROR', 'Exception during processing: ' + traceback.format_exc()))

# append results to holamundo.txt
home = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
hfile = os.path.join(home, 'holamundo.txt')
with open(hfile, 'a', encoding='utf-8') as f:
    f.write('\n---\n')
    f.write('Run model writes test\n')
    for r in results:
        f.write(f'{r[0]} => {r[1]} : {r[2]}\n')
    f.write('---\n')

# print results to console
for r in results:
    print(r[0], '=>', r[1], ':', r[2])

cur.close()
cnx.close()
