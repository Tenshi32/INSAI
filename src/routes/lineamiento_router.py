from flask import Blueprint, request, jsonify
from controller.lineamiento_controller import LineamientoController

lineamiento_bp = Blueprint('lineamiento', __name__)
ctrl = LineamientoController()

@lineamiento_bp.route('/Consultar', methods=['GET'])
def consultar():

    if request.args.get('status'):
        status = request.args.get('status')
        return jsonify(ctrl.obtener_activo(status))
    else:
        return jsonify(ctrl.listar())

@lineamiento_bp.route('/Buscar', methods=['GET'])
def buscar():
    if request.args.get('status'):
        status = request.args.get('status')
        return jsonify(ctrl.active_lineamiento(status))

@lineamiento_bp.route('/Crear', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron para crear lineamiento:", datos_recibidos)
    return jsonify(ctrl.crear(datos_recibidos))

@lineamiento_bp.route('/Editar', methods=['PUT'])
def editar():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron para editar lineamiento:", datos_recibidos)
    return jsonify(ctrl.editar(datos_recibidos))

@lineamiento_bp.route('/Toggle', methods=['PUT'])
def toggle():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron para toggle lineamiento:", datos_recibidos)
    return jsonify(ctrl.toggle(datos_recibidos))