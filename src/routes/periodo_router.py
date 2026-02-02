
from flask import Blueprint, request, jsonify
from controller.periodo_controller import PeriodoController

#Controllers
from controller import *

periodo_bp = Blueprint('periodo', __name__)
ctrl = PeriodoController()

@periodo_bp.route('/Consultar', methods=['GET'])
def consultar():
    return jsonify(ctrl.listar())

@periodo_bp.route('/ViewPeriodo', methods=['GET'])
def view_active():
    return jsonify(ctrl.periodo_active())

@periodo_bp.route('/Crear', methods=['POST'])
def crear():
    return jsonify(ctrl.crear(request.form.to_dict()))

@periodo_bp.route('/Editar', methods=['PUT'])
def editar():
    return jsonify(ctrl.editar(request.form.to_dict()))

@periodo_bp.route('/Toggle', methods=['PUT', 'DELETE'])
def toggle():
    return jsonify(ctrl.toggle(request.form.to_dict()))
