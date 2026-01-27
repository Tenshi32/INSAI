from flask import Blueprint, request, jsonify
from controller.ticket_controller import TicketController

ticket_bp = Blueprint('ticket', __name__)
ctrl = TicketController()

@ticket_bp.route('/Consultar', methods=['GET'])
def consultar():
    return jsonify(ctrl.listar())

@ticket_bp.route('/Obtener', methods=['GET'])
def obtener():
    id_ticket = request.args.get('id')
    return jsonify(ctrl.obtener(id_ticket))

@ticket_bp.route('/Crear', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.crear(datos_recibidos))

@ticket_bp.route('/Editar', methods=['PUT'])
def editar():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.editar(datos_recibidos))