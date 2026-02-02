from flask import Blueprint, request, jsonify
from controller.departamento_controller import DepartamentoController

departamento_bp = Blueprint('departamento', __name__)
ctrl = DepartamentoController()

@departamento_bp.route('/Consultar', methods=['GET'])
def consultar():
    return jsonify(ctrl.buscar_departamentos())

@departamento_bp.route('/Crear', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron para crear:", datos_recibidos)
    return jsonify(ctrl.crear_departamento(datos_recibidos))

@departamento_bp.route('/Editar', methods=['PUT'])
def editar():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron para editar:", datos_recibidos)
    return jsonify(ctrl.Edit_departamento(datos_recibidos))

@departamento_bp.route('/Toggle', methods=['PUT'])
def toggle():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron para toggle:", datos_recibidos)
    return jsonify(ctrl.Toggle_departamento(datos_recibidos))