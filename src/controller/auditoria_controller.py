from model import *
from flask import session
from datetime import datetime, date
import random

class AuditoriaController:

    def __init__(self):
        self.modelo = AuditoriaModel()

    def listar(self):
        return self.modelo.get_all_full_auditoria()

    def obtener(self, id_auditoria):
        if not id_auditoria:
            return None
        return self.modelo.get_auditoria(id_auditoria)

    def crear(self, datos: dict):
            
        try:
            if 'fecha' not in datos:
                datos['fecha'] = date.today().strftime('%Y-%m-%d')
            if 'hora' not in datos:
                datos['hora'] = datetime.now().strftime('%H:%M:%S')

            valores = [
                datos['id_data'],
                datos['hora'],
                datos['fecha'],
                datos['accion'],
                datos['descripcion']
            ]

            retorno = self.modelo.create_auditoria(valores)
            # Si el modelo devuelve algo (usualmente el ID insertado), es True
            return retorno is not None
        except Exception as e:
            print(f"Error silencioso en auditoría: {e}")
            return False

    def editar(self, datos: dict):
        if not hasattr(self.modelo, 'update_auditoria'):
            return {"status": False, "mensaje": "Función de edición no implementada en el modelo"}

        id_auditoria = datos.get('id_auditoria') or datos.get('created')
        if not id_auditoria:
            return {"status": False, "mensaje": "Falta id_auditoria"}

        valores = [
            datos.get('accion'),
            datos.get('descripcion'),
            id_auditoria
        ]

        retorno = self.modelo.update_auditoria(valores)

        if retorno is not None:
            return {"status": True, "mensaje": f"Auditoría editada id: {id_auditoria}"}
        return {"status": False, "mensaje": "No se pudo editar la auditoría"}

    def toggle(self, datos: dict):
        if not hasattr(self.modelo, 'update_statu'):
            return {"status": False, "mensaje": "Función de toggle no implementada en el modelo"}

        valores = [
            datos.get('id_auditoria')
        ]

        retorno = self.modelo.update_statu(valores)

        if retorno is not None:
            return {"status": True, "mensaje": "Estado actualizado"}
        return {"status": False, "mensaje": "No se pudo actualizar el estado"}
