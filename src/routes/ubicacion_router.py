from flask import Blueprint, request, jsonify
from controller.ubicacion_controller import UbicacionController

ubicacion_bp = Blueprint('ubicacion', __name__)
ctrl = UbicacionController()

@ubicacion_bp.route('/Crear', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.crear(datos_recibidos))

@ubicacion_bp.route('/Editar', methods=['PUT'])
def editar():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.editar(datos_recibidos))