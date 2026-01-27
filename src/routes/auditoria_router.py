from flask import Blueprint, request, jsonify
from controller.auditoria_controller import AuditoriaController

auditoria_bp = Blueprint('auditoria', __name__)
ctrl = AuditoriaController()

@auditoria_bp.route('/Consultar', methods=['GET'])
def consultar():
    return jsonify(ctrl.listar())