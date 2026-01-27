from flask import Blueprint, request, jsonify, session
from controller import *

usuario_data_bp = Blueprint('usuario_data', __name__)
ctrl = UsuarioDataController()
ctrlAuditoria = AuditoriaController()

@usuario_data_bp.route('/Consultar', methods=['GET'])
def consultar():
    return jsonify(ctrl.lista())

@usuario_data_bp.route('/Obtener', methods=['GET'])
def obtener():
    id_usuario = request.args.get('id')
    return jsonify(ctrl.obtener(id_usuario))

@usuario_data_bp.route('/Crear', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    ctrlAuditoria.crear({
        "id_data": datos_recibidos["id_data"],
        "accion": "Inicio de Sesión",
        "descripcion": f"El usuario {datos_recibidos['nombre']} {datos_recibidos['apellido']} ha iniciado sesión.",
    })
    return jsonify(ctrl.crear(datos_recibidos))

@usuario_data_bp.route('/Login', methods=['POST'])
def login():
    datos_recibidos = request.form.to_dict()

    answer = ctrl.login_full([datos_recibidos.get('email_username'), datos_recibidos.get('password')])
    
    if answer.get("id_usuario") and answer.get("statu") != "0":
        session['id_data'] = answer["id_data"]
        session['usuario_id'] = answer["id_usuario"]
        session['usuario_nombre'] = answer["nombre"]
        session['usuario_apellido'] = answer["apellido"]

        ctrlAuditoria.crear({
            "id_data": answer["id_data"],
            "accion": "Inicio de Sesión",
            "descripcion": f"El usuario {answer['nombre']} {answer['apellido']} ha iniciado sesión.",
        })

        return jsonify({
            "status": True, 
            "mensaje": "Bienvenido",    
            "datos": {"usuario": answer}
        })
        
    else:
        return jsonify(answer)

@usuario_data_bp.route('/Logout', methods=['POST'])
def logout():
    ctrlAuditoria.crear({
        "id_data": session["id_data"],
        "accion": "Cierre de Sesión",
        "descripcion": f"El usuario {session['usuario_nombre']} {session['usuario_apellido']} ha cerrado sesión.",
    })
    
    session.clear()
    return jsonify({"status": True, "mensaje": "Sesión cerrada"})