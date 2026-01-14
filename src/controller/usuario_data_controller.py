from model.usuario_data_model import UsuarioDataModel
from datetime import datetime
import random


class UsuarioDataController:

    def __init__(self):
        self.modelo = UsuarioDataModel()

    def obtener(self, id_usuario):
        if not id_usuario:
            return None
        return self.modelo.get_usuario_data(id_usuario)

    def crear(self, datos: dict):
        if 'id_usuario' not in datos:
            datos['id_usuario'] = str(random.randint(10**5, 10**10 - 1))

        valores = [
            datos['id_usuario'],
            datos.get('id_seguridad'),
            datos.get('id_pregunta'),
            datos.get('id_departamento'),
            datos.get('id_nivel')
        ]

        retorno = self.modelo.create_usuario_data(valores)

        if retorno is not None:
            return {"status": True, "mensaje": f"Usuario data creado id: {datos['id_usuario']}"}
        return {"status": False, "mensaje": "No se pudo crear usuario data"}

    def verificar_contrasena(self, contrasena_ingresada, hash_almacenado) -> bool:
        return self.modelo.verificar_contrasena(contrasena_ingresada, hash_almacenado)

    def login_full(self, datos):
        return self.modelo.login_full(datos)
    
    def login_full(self, datos):

        return self.modelo.login_full(datos)
