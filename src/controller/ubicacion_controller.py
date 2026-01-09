from model.ubicacion_model import UbicacionModel
from datetime import datetime
import random


class UbicacionController:

    def __init__(self):
        self.modelo = UbicacionModel()

    def crear(self, datos: dict):
        if 'id_ubicacion' not in datos:
            datos['id_ubicacion'] = str(random.randint(10**5, 10**10 - 1))

        valores = [
            datos['id_ubicacion'],
            datos.get('id_estado'),
            datos.get('id_municipio'),
            datos.get('estado_sede'),
            datos.get('municipio_sede')
        ]

        retorno = self.modelo.create_ubicacion(valores)

        if retorno is not None:
            return {"status": True, "mensaje": f"Ubicación creada id: {datos['id_ubicacion']}"}
        return {"status": False, "mensaje": "No se pudo crear la ubicación"}

    def editar(self, datos: dict):
        id_ubicacion = datos.get('created') or datos.get('id_ubicacion')
        if not id_ubicacion:
            return {"status": False, "mensaje": "Falta id_ubicacion"}

        valores = [
            datos.get('id_estado'),
            datos.get('id_municipio'),
            datos.get('estado_sede'),
            datos.get('municipio_sede'),
            id_ubicacion
        ]

        retorno = self.modelo.update_ubicacion(valores)

        if retorno is not None:
            return {"status": True, "mensaje": f"Ubicación editada id: {id_ubicacion}"}
        return {"status": False, "mensaje": "No se pudo editar la ubicación"}
