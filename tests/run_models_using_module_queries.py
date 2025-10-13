import sys
import os
import traceback

# Ensure model/ is importable
MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'model'))
if MODEL_DIR not in sys.path:
    sys.path.insert(0, MODEL_DIR)

modules = {
    'usuario_model': ('UsuarioModel', 'create_usuario', 'update_usuario'),
    'usuario_data_model': ('UsuarioDataModel', 'create_usuario_data', None),
    'pregunta_model': ('PreguntaModel', 'create_pregunta', 'update_pregunta'),
    'seguidad_model': ('SeguridadModel', 'create_seguridad', 'update_seguridad'),
    'ticket_model': ('TicketModel', 'create_ticket', 'update_ticket'),
    'ubicacion_model': ('UbicacionModel', 'create_ubicacion', 'update_ubicacion'),
    'periodo_model': ('PeriodoModel', 'create_periodo', 'update_periodo'),
    'metas_model': ('MetasModel', 'create_metas', 'update_metas'),
}

results = []

for mod_name, (class_name, create_name, update_name) in modules.items():
    try:
        mod = __import__(mod_name)
    except Exception as e:
        results.append((mod_name, 'IMPORT_FAIL', str(e)))
        continue
    try:
        cls = getattr(mod, class_name)
    except Exception as e:
        results.append((mod_name, 'CLASS_MISSING', str(e)))
        continue
    try:
        inst = cls()
    except Exception as e:
        results.append((mod_name, 'CONSTRUCT_FAIL', str(e)))
        continue

    # Call create
    if create_name:
        try:
            create_fn = getattr(inst, create_name)
        except Exception as e:
            results.append((mod_name, 'CREATE_MISSING', str(e)))
            continue
        # Prepare dummy args based on expected function name
        try:
            if create_name == 'create_usuario':
                datos = [None, 'Test', 'User', '2000-01-01', 'test@example.com', '000', 'Dev', '0']
            elif create_name == 'create_usuario_data':
                datos = [1, 1, 1, 1, 1]
            elif create_name == 'create_pregunta':
                datos = [None, 'p1', 'r1', 'p2', 'r2', 'p3', 'r3']
            elif create_name == 'create_seguridad':
                datos = [None, 'secuser', 'secretpw', None, 0, None, 0]
            elif create_name == 'create_ticket':
                datos = [1, '12:00', '2025-10-13', 'accion', 'desc', 0]
            elif create_name == 'create_ubicacion':
                datos = [None, 1, 1, 'estado', 'municipio']
            elif create_name == 'create_periodo':
                datos = [None, 1, 'rango', '2025-01-01', '2025-12-31', 1]
            elif create_name == 'create_metas':
                datos = [None, 'acciones', 1, 2, 1, 'desc']
            else:
                datos = [None]

            created = create_fn(datos)
            results.append((mod_name, 'CREATE_OK', f'{create_name} returned: {created}'))
        except Exception as e:
            results.append((mod_name, 'CREATE_FAIL', traceback.format_exc()))

    # Call update
    if update_name:
        try:
            update_fn = getattr(inst, update_name)
        except Exception as e:
            results.append((mod_name, 'UPDATE_MISSING', str(e)))
            continue
        try:
            # Use dummy update params; many update functions expect list
            if update_name == 'update_usuario':
                upd = ['TestUpd', 'testupd@example.com', created if isinstance(created, int) else 1]
            elif update_name == 'update_pregunta':
                upd = ['p1x','r1x','p2x','r2x','p3x','r3x', created if isinstance(created, int) else 1]
            elif update_name == 'update_seguridad':
                upd = ['ruta', 'secuser', created if isinstance(created, int) else 1]
            elif update_name == 'update_ticket':
                upd = [created if isinstance(created, int) else 1]
            elif update_name == 'update_ubicacion':
                upd = [5, 3, 'estado2', 'municipio2', created if isinstance(created, int) else 1]
            elif update_name == 'update_periodo':
                upd = ['rango2', '2025-02-01', '2025-11-30', created if isinstance(created, int) else 1]
            elif update_name == 'update_metas':
                upd = ['acciones2', 2, 3, 2, 'desc2', created if isinstance(created, int) else 1]
            else:
                upd = [1]

            updated = update_fn(upd)
            results.append((mod_name, 'UPDATE_OK', f'{update_name} returned: {updated}'))
        except Exception as e:
            results.append((mod_name, 'UPDATE_FAIL', traceback.format_exc()))

# write results to holamundo.txt
home = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
hf = os.path.join(home, 'holamundo.txt')
with open(hf, 'a', encoding='utf-8') as f:
    f.write('\n---\n')
    f.write('Run modules create/update tests\n')
    for r in results:
        f.write(f'{r[0]} => {r[1]} : {r[2]}\n')
    f.write('---\n')

# print summary
for r in results:
    print(r[0], '=>', r[1], ':', r[2])
