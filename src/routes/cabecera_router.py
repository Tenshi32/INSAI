from flask import Blueprint, request, jsonify
from controller.cabecera_data_controller import CabeceraDataController

cabecera_bp = Blueprint('cabecera', __name__)
ctrl = CabeceraDataController()

@cabecera_bp.route('/Consultar', methods=['GET'])
def consultar():
    id = request.args.get('id_lineamiento')
    if id:
        return jsonify(ctrl.obtener_revision(id))
    else:
        return jsonify(ctrl.lista())

@cabecera_bp.route('/Crear', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.crear(datos_recibidos))

@cabecera_bp.route('/Editar', methods=['PUT'])
def editar():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.editar(datos_recibidos))

@cabecera_bp.route('/Toggle', methods=['PUT'])
def toggle():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.aprobar_cabecera(datos_recibidos))