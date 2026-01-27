from flask import Blueprint, request, jsonify
from controller.select_controller import SelectController

select_bp = Blueprint('select', __name__)
ctrl = SelectController()

@select_bp.route('/Consultar', methods=['GET'])
def consultar():
    tabla = request.args.get('tabla')
    col1 = request.args.get('col1')
    col2 = request.args.get('col2')
    return jsonify(ctrl.select(col1, col2, tabla))