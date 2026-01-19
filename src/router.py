from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify, session, make_response
from flask_cors import CORS
import os

#Controllers
from controller import *

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) # Evita errores de bloqueo en el navegador 
app.secret_key = 'insaiPOA2026'

# Configuración de la carpeta de subida
UPLOAD_FOLDER = 'assets/img/avatars'

# Crear la carpeta si no existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # Límite de 5MB


@app.route('/set-cookie')
def set_cookie():
    resp = make_response("Cookie creada con éxito")
    # set_cookie(nombre, valor, tiempo_en_segundos)
    resp.set_cookie('tema_visual', 'oscuro', max_age=60*60*24) # Dura 1 día
    return resp


@app.route('/Departamento/<accion>', methods=['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'])
def Departamento(accion):

    if request.method == 'OPTIONS':
        return '', 200
    
    ctrl_departamento = DepartamentoController()

    # Metodo GET de Departamento
    if request.method == 'GET':
        if accion == "Consultar":
            answer = ctrl_departamento.buscar_departamentos()
            return jsonify(answer)

    # Metodo POST de Departamento
    elif request.method == 'POST':
        if accion == "Crear":
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para actualizar:", datos_recibidos)
            answer = ctrl_departamento.crear_departamento(datos_recibidos)
            return jsonify(answer)
        
    # Metodo PUT de Departamento
    elif request.method == 'PUT':
        if accion == "Editar":
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para actualizar:", datos_recibidos)
            answer = ctrl_departamento.Edit_departamento(datos_recibidos)
            return jsonify(answer)
        elif accion == "Toggle":
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para actualizar:", datos_recibidos)
            answer = ctrl_departamento.Toggle_departamento(datos_recibidos)
            return jsonify(answer)
        
    # Metodo DELETE de Departamento
    # elif request.method == 'DELETE':


@app.route('/Nivel/<accion>', methods=['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'])
def Nivel(accion):

    if request.method == 'OPTIONS':
        return '', 200

    ctrl_nivel = NivelController()

    # Metodo GET de Departamento
    if request.method == 'GET':
        if accion == 'Consultar':
            answer = ctrl_nivel.buscar_nivel()
            return jsonify(answer)


@app.route('/Select/<accion>', methods=['GET', 'OPTIONS'])
def Select(accion):

    if request.method == 'OPTIONS':
        return '', 200

    ctrl_select = SelectController()

    # Metodo GET de Departamento
    if request.method == 'GET':
        tabla = request.args.get('tabla')
        col1 = request.args.get('col1')
        col2 = request.args.get('col2')

        if accion == 'Consultar':
            answer = ctrl_select.select(col1, col2, tabla)
            return jsonify(answer)


@app.route('/Usuario/<accion>', methods=['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'])
def Usuario(accion):

    if request.method == 'OPTIONS':
        return '', 200

    ctrl_usuario = UsuarioController()

    # Metodo GET de Departamento
    if request.method == 'GET':
        if accion == 'Consultar':
            answer = ctrl_usuario.buscar_usuarios()
            return jsonify(answer)

    # Metodo POST de Departamento
    elif request.method == 'POST':
        if accion == 'SubirFoto':

            file = request.files['archivo']

            nombre_seguro = secure_filename(file.filename)

            ruta_final = os.path.join(app.config['UPLOAD_FOLDER'], nombre_seguro)

            file.save(ruta_final)

            return jsonify({
                "status": True,
                "nombre_archivo": nombre_seguro,
                "url_completa": f"../../assets/img/avatars/{nombre_seguro}" 
            })
        
        elif accion == 'EliminarFoto':

            nombre_archivo = request.form.get('nombre_archivo')
        
            if not nombre_archivo:
                return jsonify({"status": False, "mensaje": "Falta el nombre del archivo"}), 400

            # Construir la ruta al archivo
            ruta_archivo = os.path.join(f"assets/img/avatars/", nombre_archivo) 
            print(ruta_archivo)
            try:
                # Verificar si el archivo existe antes de borrar
                if os.path.exists(ruta_archivo):

                    os.remove(ruta_archivo)
                    return jsonify({"status": True})
                
                else:

                    # Si no existe en disco, igual limpiamos el front
                    return jsonify({"status": True, "mensaje": "El archivo no existía, pero se limpió el registro"})
                
            except Exception as e:
                return jsonify({"status": False, "mensaje": f"Error al eliminar: {str(e)}"}), 500
        
        else:

            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para actualizar:", datos_recibidos)
            answer = ctrl_usuario.crear_usuario(datos_recibidos)
            return jsonify(answer)
        
    # Metodo PUT de Departamento
    elif request.method == 'PUT':

        if accion == 'Editar':
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para actualizar:", datos_recibidos)
            answer = ctrl_usuario.Edit_usuario(datos_recibidos)
            return jsonify(answer)
        
        elif accion == 'Toggle': 
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para actualizar:", datos_recibidos)
            answer = ctrl_usuario.Toggle_usuario(datos_recibidos)
            return jsonify(answer)
        
    # Metodo DELETE de Departamento
    elif request.method == 'DELETE':
        datos_recibidos = request.form.to_dict()
        print("Datos que llegaron para actualizar:", datos_recibidos)
        answer = ctrl_usuario.Toggle_usuario(datos_recibidos)
        return jsonify(answer)


@app.route('/Comunicatorio/<accion>', methods=['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'])
def Comunicatorio(accion):

    if request.method == 'OPTIONS':
        return '', 200

    ctrl_comunicatorio = ComunicatorioController()

    # Metodo GET de Departamento
    if request.method == 'GET':
        if accion == 'Consultar':
            answer = ctrl_comunicatorio.buscar_comunicatorios()
            return jsonify(answer)

    # Metodo POST de Departamento
    elif request.method == 'POST':

            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para actualizar:", datos_recibidos)

            answer = ctrl_comunicatorio.crear_comunicatorio(datos_recibidos)
            return jsonify(answer)
        
    # Metodo PUT de Departamento
    elif request.method == 'PUT':

        if accion == 'Editar':
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para actualizar:", datos_recibidos)
            answer = ctrl_comunicatorio.Edit_comunicatorio(datos_recibidos)
            return jsonify(answer)
        
        elif accion == 'Toggle': 
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para actualizar:", datos_recibidos)
            answer = ctrl_comunicatorio.Toggle_comunicatorio(datos_recibidos)
            return jsonify(answer)
        
    # Metodo DELETE de Departamento
    elif request.method == 'DELETE':
        datos_recibidos = request.form.to_dict()
        print("Datos que llegaron para actualizar:", datos_recibidos)
        answer = ctrl_comunicatorio.Toggle_comunicatorio(datos_recibidos)
        return jsonify(answer)


@app.route('/Lineamiento/<accion>', methods=['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'])
def Lineamiento(accion):

    if request.method == 'OPTIONS':
        return '', 200

    ctrl_Lineamiento = LineamientoController()

    # GET -> Consultar
    if request.method == 'GET':
        if accion == 'Consultar':
            answer = ctrl_Lineamiento.listar()
            return jsonify(answer)
        
        if accion == 'Buscar':
            answer = ctrl_Lineamiento.active_lineamiento()
            return jsonify(answer)

    # POST -> Crear
    elif request.method == 'POST':
        if accion == 'Crear':
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para crear lineamiento:", datos_recibidos)
            answer = ctrl_Lineamiento.crear(datos_recibidos)
            return jsonify(answer)

    # PUT -> Editar / Toggle
    elif request.method == 'PUT':
        if accion == 'Editar':
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para editar lineamiento:", datos_recibidos)
            answer = ctrl_Lineamiento.editar(datos_recibidos)
            return jsonify(answer)

        elif accion == 'Toggle':
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para toggle lineamiento:", datos_recibidos)
            answer = ctrl_Lineamiento.toggle(datos_recibidos)
            return jsonify(answer)

    # DELETE -> Toggle (same behavior)
    elif request.method == 'DELETE':
        datos_recibidos = request.form.to_dict()
        print("Datos que llegaron para toggle lineamiento (DELETE):", datos_recibidos)
        answer = ctrl_Lineamiento.toggle(datos_recibidos)
        return jsonify(answer)


@app.route('/Periodo/<accion>', methods=['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'])
def Periodo(accion):

    if request.method == 'OPTIONS':
        return '', 200

    ctrl_Periodo = PeriodoController()

    # GET -> Consultar
    if request.method == 'GET':
        if accion == 'Consultar':
            answer = ctrl_Periodo.listar()
            return jsonify(answer)
        
        if accion == 'ViewPeriodo':
            answer = ctrl_Periodo.periodo_active()
            return jsonify(answer)

    # POST -> Crear
    elif request.method == 'POST':
        if accion == 'Crear':
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para crear lineamiento:", datos_recibidos)
            answer = ctrl_Periodo.crear(datos_recibidos)
            return jsonify(answer)

    # PUT -> Editar / Toggle
    elif request.method == 'PUT':
        if accion == 'Editar':
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para editar lineamiento:", datos_recibidos)
            answer = ctrl_Periodo.editar(datos_recibidos)
            return jsonify(answer)

        elif accion == 'Toggle':
            datos_recibidos = request.form.to_dict()
            print("Datos que llegaron para toggle lineamiento:", datos_recibidos)
            answer = ctrl_Periodo.toggle(datos_recibidos)
            return jsonify(answer)

    # DELETE -> Toggle (same behavior)
    elif request.method == 'DELETE':
        datos_recibidos = request.form.to_dict()
        print("Datos que llegaron para toggle lineamiento (DELETE):", datos_recibidos)
        answer = ctrl_Periodo.toggle(datos_recibidos)
        return jsonify(answer)


@app.route('/UsuarioData/<accion>', methods=['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'])
def UsuarioData(accion):

    if request.method == 'OPTIONS':
        return '', 200

    ctrl_UsuarioData = UsuarioDataController()

    if request.method == 'GET':
        if accion == 'Obtener':
            id_usuario = request.args.get('id')
            answer = ctrl_UsuarioData.obtener(id_usuario)
            return jsonify(answer)
        
        elif accion == 'Consultar':
            answer = ctrl_UsuarioData.lista()
            return jsonify(answer)

    elif request.method == 'POST':
        if accion == 'Crear':
            datos_recibidos = request.form.to_dict()
            answer = ctrl_UsuarioData.crear(datos_recibidos)
            return jsonify(answer)
        
        if accion == 'Login':
            datos_recibidos = request.form.to_dict()
            answer = ctrl_UsuarioData.login_full([datos_recibidos.get('email_username'), datos_recibidos.get('password')])
            
            if answer.get("id_usuario") and answer.get("statu") != "0":
            # Si el login es correcto (answer no es None)
                session['usuario_id'] = answer["id_usuario"]
                session['usuario_nombre'] = answer["nombre"]

                return jsonify({"status": True, 
                                "mensaje": "Bienvenido", 
                                "datos": {
                                    "usuario": answer
                                    }
                               })

            else:
            # Si las credenciales fallaron (answer es None)
                return jsonify(answer)
           

        
        if accion == 'Logout':
            

            session.clear()
            

@app.route('/Ubicacion/<accion>', methods=['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'])
def Ubicacion(accion):

    if request.method == 'OPTIONS':
        return '', 200

    ctrl_Ubicacion = UbicacionController()

    if request.method == 'POST' and accion == 'Crear':
        datos_recibidos = request.form.to_dict()
        answer = ctrl_Ubicacion.crear(datos_recibidos)
        return jsonify(answer)

    if request.method == 'PUT' and accion == 'Editar':
        datos_recibidos = request.form.to_dict()
        answer = ctrl_Ubicacion.editar(datos_recibidos)
        return jsonify(answer)


@app.route('/Ticket/<accion>', methods=['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'])
def Ticket(accion):

    if request.method == 'OPTIONS':
        return '', 200

    ctrl_Ticket = TicketController()

    if request.method == 'GET':
        if accion == 'Consultar':
            answer = ctrl_Ticket.listar()
            return jsonify(answer)
        if accion == 'Obtener':
            id_ticket = request.args.get('id')
            answer = ctrl_Ticket.obtener(id_ticket)
            return jsonify(answer)

    if request.method == 'POST' and accion == 'Crear':
        datos_recibidos = request.form.to_dict()
        answer = ctrl_Ticket.crear(datos_recibidos)
        return jsonify(answer)

    if request.method == 'PUT' and accion == 'Editar':
        datos_recibidos = request.form.to_dict()
        answer = ctrl_Ticket.editar(datos_recibidos)
        return jsonify(answer)


@app.route('/Auditoria/<accion>', methods=['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'])
def Cabecera(accion):

    if request.method == 'OPTIONS':
        return '', 200

    ctrl_Auditoria = AuditoriaController()

    if request.method == 'GET':
        if accion == 'Consultar':
            answer = ctrl_Auditoria.listar()
            return jsonify(answer)


@app.route('/CabeceraData/<accion>', methods=['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'])
def Auditoria(accion):

    if request.method == 'OPTIONS':
        return '', 200

    ctrl_DataCabecera = CabeceraDataController()

    if request.method == 'GET':
        if accion == 'Consultar':
            answer = ctrl_DataCabecera.lista()
            return jsonify(answer)
        
    if request.method == 'POST' and accion == 'Crear':
        datos_recibidos = request.form.to_dict()
        answer = ctrl_DataCabecera.crear(datos_recibidos)
        return jsonify(answer)

    if request.method == 'PUT' and accion == 'Editar':
        datos_recibidos = request.form.to_dict()
        answer = ctrl_DataCabecera.editar(datos_recibidos)
        return jsonify(answer)



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)