from flask import Blueprint, request, jsonify
from controller.nivel_controller import NivelController

nivel_bp = Blueprint('nivel', __name__)
ctrl = NivelController()

@nivel_bp.route('/Consultar', methods=['GET'])
def consultar():
    return jsonify(ctrl.buscar_nivel())