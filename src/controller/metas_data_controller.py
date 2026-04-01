from model import *
from flask import session
from datetime import date
import random


class MetasDataController:

    def __init__(self):
        self.modelo = MetasDataModel()
        self.modeloMetas = MetasModel()
        self.modeloUbicacion = UbicacionModel()
        self.modeloAuditoria = AuditoriaModel()

    def lista(self):
        return self.modelo.get_full_cabecera_data()
    
    def obtener_revision(self, id_lineamiento):
        if not id_lineamiento:
            return None
        return self.modelo.get_full_metas_revision(id_lineamiento)
    
    def listaXplanificacion(self, id_planificacion):
        if not id_planificacion:
            return None
        return self.modelo.get_formulacion_x_planificacion(id_planificacion)
    
    def status_planificacion(self, id_departamento, id_lineamiento):
        if not id_departamento:
            return None
        return self.modelo.get_cabeceras_x_departamento_status(id_departamento, id_lineamiento)
    
    def obtener(self, id_usuario):
        if not id_usuario:
            return None
        return self.modelo.get_usuario_data(id_usuario)
    
    def aprobar_cabecera(self, datos):
        if not datos:
            return None
        
        retorno = self.modeloCabecera.status_cabecera(datos["id_cabecera"], '2')
    
        if retorno is not None:

            return {"status": True, "mensaje": "se cambio el estado a la planificacion del id: " + datos['id_cabecera']}
        
        else:

            return {"status": False, "mensaje": "No se pudo guardar el registro"}

    def crear(self, datos: dict):

        numero = random.randint(10**4, 10**12 - 1)
        datos["codigo"] = numero
        datos['hora'] = date.today().strftime('%H:%M:%S')
        datos["fecha"] = date.today().strftime('%Y-%m-%d')

        valores_cabecera = [
            datos['codigo'],
            datos['meta_fisica'],
            datos['trim1'],
            datos['trim2'],
            datos['trim3'],
            datos['trim4'],
            datos['trimtotal'],
            datos['acciones'],
            '1'
        ]

        retorno = self.modeloMetas.create_metas(valores_cabecera)

        valores_ubicacion = [
            datos['codigo'],
            datos['estados'],
            datos['municipio'],
            datos['sede_ubicacion']
        ]

        retorno = self.modeloUbicacion.create_ubicacion(valores_ubicacion)

        valores_data = [
            datos['codigo'],
            datos['codigo'],
            1,
            datos['id_planificacion_activa'],
            datos['codigo']
        ]

        retorno = self.modelo.create_metas_data(valores_data)
        
        if retorno is not None:

            valores = [
                session['usuario_id'],
                datos['hora'],
                datos["fecha"],
                "Meta Creado",
                f"Meta creada con el codigo : {datos['codigo']} por el usuario {session['usuario_id']}"
            ]

            self.modeloAuditoria.create_auditoria(valores)

            return {"status": True, "mensaje": f"Formulacion creado con el codigo : {datos['codigo']}"}
        
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
