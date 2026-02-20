from flask import Blueprint, request, jsonify
from controller.cabecera_data_controller import CabeceraDataController

cabecera_data_bp = Blueprint('cabecera_data', __name__)
ctrl = CabeceraDataController()

@cabecera_data_bp.route('/Obtener', methods=['GET'])
def Obtener():
    id_departamento = request.args.get('id_departamento')
    id_lineamiento = request.args.get('id_lineamiento')
    
    if id_departamento:
        return jsonify(ctrl.status_planificacion(id_departamento, id_lineamiento))

    
@cabecera_data_bp.route('/Consultar', methods=['GET'])
def consultar():
    id_lineamiento = request.args.get('id_lineamiento')
    id_departamento = request.args.get('id_departamento')
    
    if id_lineamiento:
        return jsonify(ctrl.obtener_revision(id_lineamiento))
    
    elif id_departamento:
        return jsonify(ctrl.listaXdepartamento(id_departamento))
    
    else:
        return jsonify(ctrl.lista())

@cabecera_data_bp.route('/Crear', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.crear(datos_recibidos))

@cabecera_data_bp.route('/Editar', methods=['PUT'])
def editar():
    datos_recibidos = request.form.to_dict()
    return jsonify(ctrl.editar(datos_recibidos))