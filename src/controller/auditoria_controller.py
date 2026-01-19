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
        if 'id_auditoria' not in datos:
            datos['id_auditoria'] = str(random.randint(10**5, 10**10 - 1))
        if 'fecha' not in datos:
            datos['fecha'] = date.today().strftime('%Y-%m-%d')
        if 'hora' not in datos:
            datos['hora'] = datetime.now().strftime('%H:%M:%S')

        valores = [
            datos.get('id_data'),
            datos.get('hora'),
            datos.get('fecha'),
            datos.get('accion'),
            datos.get('descripcion')
        ]

        retorno = self.modelo.create_auditoria(valores)

        if retorno is not None:
            return {"status": True, "mensaje": f"Auditoría creada id: {datos['id_auditoria']}"}
        return {"status": False, "mensaje": "No se pudo crear la auditoría"}

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
