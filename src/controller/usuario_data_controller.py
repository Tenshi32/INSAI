from model import *

from datetime import datetime
import random


class UsuarioDataController:

    def __init__(self):
        self.modelo = UsuarioDataModel()
        self.modeloUsuario = UsuarioModel()
        self.modeloPregunta = PreguntaModel()
        self.modeloSeguridad = SeguridadModel()

    def lista(self):
        return self.modelo.get_all_suario_data()
    
    def obtener(self, id_usuario):
        if not id_usuario:
            return None
        return self.modelo.get_usuario_data(id_usuario)

    def crear(self, datos: dict):

        valores_usuario = [
            datos['cedula'],
            datos['firstName'],
            datos['lastName'],
            datos['fechan'],
            datos['email'],
            datos['numerocel'],
            'Dev'
        ]

        retorno = self.modeloUsuario.create_usuario(valores_usuario)

        valores_pregunta = [
            datos['cedula'],
            datos['pregunta1'],
            datos['repuesta1'],
            datos['pregunta2'],
            datos['repuesta2'],
            datos['pregunta3'],
            datos['repuesta3']
        ]

        retorno = self.modeloPregunta.create_pregunta(valores_pregunta)

        valores_seguridad = [
            datos['cedula'],
            datos['usuario'],
            datos['contraseña'],
            datos['foto_ruta'],
            0
        ]

        retorno = self.modeloSeguridad.create_seguridad(valores_seguridad)

        valores_data = [
            datos['cedula'],
            datos['cedula'],
            datos['cedula'],
            datos['departamento'],
            datos['nivel']
        ]

        retorno = self.modelo.create_usuario_data(valores_data)

        if retorno is not None:
            return {"status": True, "mensaje": f"Usuario data creado id: {datos['cedula']}"}
        else:
            return {"status": False, "mensaje": "No se pudo crear usuario data"}

    def verificar_contrasena(self, contrasena_ingresada, hash_almacenado) -> bool:
        return self.modelo.verificar_contrasena(contrasena_ingresada, hash_almacenado)

    def login_full(self, datos):
        usuario = self.modelo.login_full(datos)

        if usuario == None : 
            return {"status": False, "mensaje": "Correo o Usuario incorrectos"}
        
        elif usuario["statu"] == "0" :
            return {"status": False, "mensaje": "Usuario Bloqueado"}
        
        elif usuario["statu"] == False : 
            return {"status": False, "mensaje": f"Contraseña incorrecta, van {usuario["cont_fail"]} de 3 intentos antes de que se bloquee"}
        
        else:
            return usuario
