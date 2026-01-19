from model import *
from flask import session
from datetime import date
import random


class CabeceraDataController:

    def __init__(self):
        self.modelo = CabeceraDataModel()
        self.modeloCabecera = CabeceraModel()
        self.modeloAuditoria = AuditoriaModel()

    def lista(self):
        return self.modelo.get_full_cabecera_data()
    
    def obtener(self, id_usuario):
        if not id_usuario:
            return None
        return self.modelo.get_usuario_data(id_usuario)

    def crear(self, datos: dict):
        numero = random.randint(10**4, 10**12 - 1)
        datos["codigo"] = numero
        datos['hora'] = date.now().strftime('%H:%M:%S')
        datos["fecha"] = date.today().strftime('%Y-%m-%d')

        valores_cabecera = [
            datos['codigo'],
            datos['proyecto'],
            datos['enfoque_estrategico'],
            datos['sector'],
            datos['objetivos'],
            datos['actividad']
        ]

        retorno = self.modeloCabecera.create_cabecera(valores_cabecera)

        valores_data = [
            datos['codigo'],
            datos['codigo'],
            datos['id_lineamiento'],
            datos['id_departamento'],
            1,
            datos['tipo_poa']
        ]

        retorno = self.modelo.create_cabecera_data(valores_data)
        


        if retorno is not None:

            valores = [
                session['usuario_id'],
                datos['hora'],
                datos["fecha"],
                "Objetivo Creado",
                f"Objetivo creado con el codigo : {datos['codigo']} por el usuario {session['usuario_id']}"
            ]

            self.modeloAuditoria.create_auditoria(valores)

            return {"status": True, "mensaje": f"Objetivo creado con el codigo : {datos['codigo']}"}
        
        else:

            return {"status": False, "mensaje": "No se pudo crear usuario data"}
    
    def editar(self, datos: dict):

        valores_usuario = [
            datos['cedula'],
            datos['firstName'],
            datos['lastName'],
            datos['fechan'],
            datos['email'],
            datos['numerocel'],
            'Dev'
        ]

        retorno = self.modelo.edit_cabecera_data(valores_usuario)

        valores_pregunta = [
            datos['cedula'],
            datos['pregunta1'],
            datos['repuesta1'],
            datos['pregunta2'],
            datos['repuesta2'],
            datos['pregunta3'],
            datos['repuesta3']
        ]

        retorno = self.modeloCabecera.create_cabecera(valores_pregunta)
 

        if retorno is not None:
            return {"status": True, "mensaje": f"Usuario data creado id: {datos['cedula']}"}
        return {"status": False, "mensaje": "No se pudo crear usuario data"}
