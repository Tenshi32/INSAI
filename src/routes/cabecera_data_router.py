from flask import Blueprint, request, jsonify
from controller.cabecera_data_controller import CabeceraDataController

cabecera_data_bp = Blueprint('cabecera_data', __name__)
ctrl = CabeceraDataController()

@cabecera_data_bp.route('/Consultar', methods=['GET'])
def consultar():
    return jsonify(ctrl.lista())

@cabecera_data_bp.route('/Crear', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.crear(datos_recibidos))

@cabecera_data_bp.route('/Editar', methods=['PUT'])
def editar():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.editar(datos_recibidos))