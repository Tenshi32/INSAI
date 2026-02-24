from flask import Blueprint, request, jsonify
from controller.metas_data_controller import MetasDataController

metas_data_bp = Blueprint('metas_data', __name__)
ctrl = MetasDataController()

@metas_data_bp.route('/Obtener', methods=['GET'])
def Obtener():
    id_departamento = request.args.get('id_departamento')
    id_lineamiento = request.args.get('id_lineamiento')
    
    if id_departamento:
        return jsonify(ctrl.status_planificacion(id_departamento, id_lineamiento))

@metas_data_bp.route('/Consultar', methods=['GET'])
def consultar():
    id_planificacion = request.args.get('id_planificacion')
    id_lineamiento = request.args.get('id_lineamiento')
    
    if id_planificacion:
        return jsonify(ctrl.listaXplanificacion(id_planificacion))
    
    elif id_lineamiento:
        return jsonify(ctrl.obtener_revision(id_lineamiento))
    else:
        return jsonify(ctrl.lista())

@metas_data_bp.route('/Crear', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.crear(datos_recibidos))

@metas_data_bp.route('/Editar', methods=['PUT'])
def editar():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.editar(datos_recibidos))