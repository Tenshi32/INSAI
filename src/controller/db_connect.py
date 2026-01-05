from flask import Blueprint, send_file, request, jsonify
from model.db_connect import DbConnect

class ControladorDb:
    def __init__(self):
        db_instance = DbConnect()
       
    def export_bd(self):
        resultado = self.db_instance.exporte()
        return resultado
        
    def import_db(self):
        resultado = self.db_instance.importe()
        return resultado