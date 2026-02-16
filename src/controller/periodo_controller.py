from model.periodo_model import PeriodoModel
from datetime import datetime
import random


class PeriodoController:

    def __init__(self):
        self.modelo = PeriodoModel()

    def listar(self):
        return self.modelo.get_all_periodo()
    
    def periodo_active(self):
        # Obtener todos los periodos y devolver el primero con statu == 1
        return self.modelo.get_active_periodo()

    def obtener(self, id_periodo):

        if not id_periodo:
            return None
        
        return self.modelo.get_all_periodo()


    def crear(self, datos: dict):
        # Preparar datos directamente desde `datos` en forma de lista
        if 'id_periodo' not in datos:
            datos['id_periodo'] = str(random.randint(10**5, 10**10 - 1))
        if 'statu' not in datos:
            datos['statu'] = 1

        valores = [
            datos['id_periodo'],
            datos['id_lineamiento'],
            datos['anno'],
            datos['fecha_inicio'],
            datos['fecha_final'],
            datos['statu']
        ]

        retorno = self.modelo.create_periodo(valores)

        if retorno is not None:
            return {"status": True, "mensaje": f"Periodo creado id: {datos['id_periodo']}"}
        else:
            return {"status": False, "mensaje": "No se pudo crear el periodo"}

    def editar(self, datos: dict):
        # Usar la estructura lista con campos directos
        id_periodo = datos.get('id_periodo') or datos.get('created')
        if not id_periodo:
            return {"status": False, "mensaje": "Falta id_periodo"}

        valores = [
            datos['rango'],
            datos['fecha_inicio'],
            datos['fecha_final'],
            id_periodo
        ]

        retorno = self.modelo.update_periodo(valores)

        if retorno is not None:
            return {"status": True, "mensaje": f"Periodo editado id: {id_periodo}"}
        else:
            return {"status": False, "mensaje": "No se pudo editar el periodo"}

    def toggle(self, datos: dict):
        # Intenta alternar el estado (marca statu = 1)
        valores = [
            datos['id_periodo'],
        ]
        retorno = self.modelo.update_statu(valores)
        
        if retorno is not None:
            return {"status": True, "mensaje": "Estado actualizado"}
        
        return {"status": False, "mensaje": "No se pudo actualizar el estado"}
