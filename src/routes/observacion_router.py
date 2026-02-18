from flask import Blueprint, request, jsonify
from controller.observacion_controller import ObservacionController

observacion_bp = Blueprint('observacion', __name__)
ctrl = ObservacionController()

@observacion_bp.route('/Consultar', methods=['GET'])
def consultar():
    id = request.args.get('id_lineamiento')
    if id:
        return jsonify(ctrl.obtener_revision(id))
    else:
        return jsonify(ctrl.lista())

@observacion_bp.route('/Crear', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.crear(datos_recibidos))

@observacion_bp.route('/Editar', methods=['PUT'])
def editar():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.editar(datos_recibidos))

@observacion_bp.route('/Toggle', methods=['PUT'])
def toggle():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.aprobar_cabecera(datos_recibidos))