import sys

try:
    import mysql.connector
except Exception as e:
    print('mysql.connector not available:', e)
    sys.exit(2)

params = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'insai_poa'
}

try:
    cnx = mysql.connector.connect(**params)
    cur = cnx.cursor()
    print('Connected to MySQL OK')
except Exception as e:
    print('Failed to connect:', e)
    sys.exit(3)

try:
    cur.execute('SHOW TABLES')
    tables = [row[0] for row in cur.fetchall()]
    print('Tables in database:', tables)

    # Tables of interest (based on model filenames)
    interesting = ['usuarios','seguridad','pregunta','usuario_data','metas','observacion','ticket','ubicacion']
    for t in interesting:
        if t in tables:
            try:
                cur.execute(f'SELECT COUNT(*) FROM `{t}`')
                cnt = cur.fetchone()[0]
                print(f'Table {t}: {cnt} rows')
            except Exception as e:
                print(f'Could not read from table {t}:', e)
        else:
            print(f'Table {t}: NOT FOUND')

    # Also show a sample of up to 3 rows for each table present (safe read)
    for t in tables:
        try:
            cur.execute(f'SELECT * FROM `{t}` LIMIT 3')
            rows = cur.fetchall()
            print(f'Sample rows from {t}:')
            for r in rows:
                print('  ', r)
        except Exception as e:
            print(f'Cannot fetch sample from {t}:', e)

except Exception as e:
    print('Error while inspecting database:', e)
finally:
    try:
        cur.close()
        cnx.close()
    except Exception:
        pass

print('Done')
