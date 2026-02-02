from flask import Blueprint, jsonify
from controller.database_controller import DatabaseController

database_bp = Blueprint('database', __name__)
ctrl = DatabaseController()

@database_bp.route('/Exportar', methods=['POST'])
def exportar():
    return ctrl.exportar()

@database_bp.route('/Importar', methods=['POST'])
def importar():
    return ctrl.importar()