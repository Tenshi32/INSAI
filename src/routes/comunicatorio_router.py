from flask import Blueprint, request, jsonify
from controller.comunicatorio_controller import ComunicatorioController

comunicatorio_bp = Blueprint('comunicatorio', __name__)
ctrl = ComunicatorioController()

@comunicatorio_bp.route('/Consultar', methods=['GET'])
def consultar():
    statu = request.args.get('statu')
    id_lineamiento = request.args.get('id_lineamiento')
    if statu:
        return jsonify(ctrl.buscar_comunicatorio_activo(statu, id_lineamiento))
    else:
        return jsonify(ctrl.buscar_comunicatorios())

@comunicatorio_bp.route('/Crear', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.crear_comunicatorio(datos_recibidos))

@comunicatorio_bp.route('/Editar', methods=['PUT'])
def editar():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron para editar:", datos_recibidos)
    return jsonify(ctrl.Edit_comunicatorio(datos_recibidos))

@comunicatorio_bp.route('/Toggle', methods=['PUT'])
def toggle():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron para toggle:", datos_recibidos)
    return jsonify(ctrl.Toggle_comunicatorio(datos_recibidos))