from model import *
from datetime import date
import random

class LineamientoController:

    def __init__(self):
        self.modelo = LineamientoModel()

    def listar(self):
        return self.modelo.get_all_lineamiento()

    def obtener(self, id):
        if not id:
            return None
        return self.modelo.get_lineamiento(id)
    
    def obtener_activo(self, status):
        if not status:
            return None
        return self.modelo.lineamiento_active(status)

    def active_lineamiento(self, status):
        return self.modelo.lineamiento_active(status)

    def crear(self, datos: dict):
        numero = random.randint(10**4, 10**10 - 1)
        datos['id_lineamiento'] = numero
        datos['fecha_carga'] = date.today().strftime('%Y-%m-%d')

        valores = [
            datos['id_lineamiento'],
            datos['normas_legales'],
            datos['enfoque_estrategico'],
            datos['lineamientos'],
            datos['metas_alcanzar'],
            datos['fecha_carga']
        ]
        retorno = self.modelo.create_lineamiento(valores)

        # Preparar datos para crear periodo (modelo espera 6 valores)
        if 'statu' not in datos:
            datos['statu'] = 1

        valores_periodo = [
            datos['id_lineamiento'],
            datos['id_lineamiento'],
            datos['rango'],
            datos['fecha_inicio'],
            datos['fecha_cierre'],
            datos['statu']
        ]
        periodo = PeriodoModel()
        retorno = periodo.create_periodo(valores_periodo)

        if retorno is not None:
            return {"status": True, "mensaje": f"Registro creado id: {datos['id_lineamiento']}"}
        else:
            return {"status": False, "mensaje": "No se pudo guardar el registro"}

    def editar(self, datos: dict):
        if 'id_lineamiento' not in datos and 'created' in datos:
            datos['id_lineamiento'] = datos['created']

        if 'id_lineamiento' not in datos:
            return {"status": False, "mensaje": "Falta el id del lineamiento"}

        if 'fecha_carga' not in datos:
            datos['fecha_carga'] = date.today().strftime('%Y-%m-%d')

        valores = [
            datos['normas_legales'],
            datos['enfoque_estrategico'],
            datos['lineamientos'],
            datos['fecha_carga'],
            datos['id_lineamiento']
        ]

        retorno = self.modelo.update_lineamiento(valores)

        if retorno is not None:
            return {"status": True, "mensaje": f"Se editó el lineamiento id: {datos['id_lineamiento']}"}
        else:
            return {"status": False, "mensaje": "No se pudo guardar el registro"}

    def toggle(self, datos: dict):

        valores = [
            datos['status'],
            datos['id_lineamiento']
        ]
        retorno = self.modelo.status_lineamiento(valores)
        if retorno is not None:
            return {"status": True, "mensaje": "Estado actualizado"}
        return {"status": False, "mensaje": "No se pudo cambiar el estado"}
        