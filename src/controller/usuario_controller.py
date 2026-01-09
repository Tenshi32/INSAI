from model.usuario_model import UsuarioModel
from datetime import datetime
import random


class UsuarioController:

    def __init__(self):
        self.modelo = UsuarioModel()

    def listar(self):
        return self.modelo.get_all_usuarios()

    def obtener(self, id_usuario):
        if not id_usuario:
            return None
        return self.modelo.get_usuario(id_usuario)

    def crear(self, datos: dict):
        if 'id_usuario' not in datos:
            datos['id_usuario'] = str(random.randint(10**5, 10**10 - 1))

        valores = [
            datos['id_usuario'],
            datos.get('firstName') or datos.get('nombre'),
            datos.get('lastName') or datos.get('apellido'),
            datos.get('fechan') or datos.get('fecha_nacimiento'),
            datos.get('email'),
            datos.get('numerocel') or datos.get('telefono'),
            datos.get('profesion', 'Dev')
        ]

        retorno = self.modelo.create_usuario(valores)

        if retorno is not None:
            return {"status": True, "mensaje": f"Usuario creado id: {datos['id_usuario']}"}
        else:
            return {"status": False, "mensaje": "No se pudo crear el usuario"}

    def editar(self, datos: dict):
        id_usuario = datos.get('created') or datos.get('id_usuario')
        if not id_usuario:
            return {"status": False, "mensaje": "Falta id_usuario"}

        valores = [
            datos.get('cedula') or datos.get('id_usuario'),
            datos.get('firstName') or datos.get('nombre'),
            datos.get('lastName') or datos.get('apellido'),
            datos.get('fechan') or datos.get('fecha_nacimiento'),
            datos.get('email'),
            datos.get('numerocel') or datos.get('telefono'),
            id_usuario
        ]

        retorno = self.modelo.update_usuario(valores)

        if retorno is not None:
            return {"status": True, "mensaje": f"Usuario editado id: {id_usuario}"}
        else:
            return {"status": False, "mensaje": "No se pudo editar el usuario"}

    def toggle(self, datos: dict):
        valores = [
            datos.get('status'),
            datos.get('id_usuario')
        ]
        retorno = self.modelo.toggle_usuario(valores)

        if retorno is not None:
            return {"status": True, "mensaje": "Estado actualizado"}
        return {"status": False, "mensaje": "No se pudo actualizar el estado"}
    

        