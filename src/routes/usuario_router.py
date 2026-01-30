from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from controller.usuario_controller import UsuarioController

usuario_bp = Blueprint('usuario', __name__)
ctrl = UsuarioController()

UPLOAD_FOLDER = 'assets/img/avatars'

@usuario_bp.route('/Consultar', methods=['GET'])
def consultar():
    return jsonify(ctrl.listar())

@usuario_bp.route('/Crear', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron para crear:", datos_recibidos)
    return jsonify(ctrl.crear(datos_recibidos))

@usuario_bp.route('/Editar', methods=['PUT'])
def editar():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron para editar:", datos_recibidos)
    return jsonify(ctrl.editar(datos_recibidos))

@usuario_bp.route('/Toggle', methods=['PUT'])
def toggle():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron para toggle:", datos_recibidos)
    return jsonify(ctrl.toggle(datos_recibidos))

@usuario_bp.route('/SubirFoto', methods=['POST'])
def subir_foto():
    file = request.files['archivo']
    nombre_seguro = secure_filename(file.filename)
    ruta_final = os.path.join(UPLOAD_FOLDER, nombre_seguro)
    file.save(ruta_final)
    return jsonify({
        "status": True,
        "nombre_archivo": nombre_seguro,
        "url_completa": f"../../assets/img/avatars/{nombre_seguro}"
    })

@usuario_bp.route('/EliminarFoto', methods=['POST'])
def eliminar_foto():
    nombre_archivo = request.form.get('nombre_archivo')
    if not nombre_archivo:
        return jsonify({"status": False, "mensaje": "Falta el nombre del archivo"}), 400
    ruta_archivo = os.path.join(f"assets/img/avatars/", nombre_archivo)
    try:
        if os.path.exists(ruta_archivo):
            os.remove(ruta_archivo)
            return jsonify({"status": True})
        else:
            return jsonify({"status": True, "mensaje": "El archivo no existía, pero se limpió el registro"})
    except Exception as e:
        return jsonify({"status": False, "mensaje": f"Error al eliminar: {str(e)}"}), 500