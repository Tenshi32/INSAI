from model.comunicatorio_model import ComunicatorioModel
from model.auditoria_model import AuditoriaModel
import random
from datetime import date

class ComunicatorioController:

    def __init__(self):
        # Instantiate the model here (lazy DB connection inside model)
        self.modelo = ComunicatorioModel()
        self.auditoria = AuditoriaModel()


    def buscar_comunicatorios(self):
        return self.modelo.get_comunicatorios()

    def buscar_comunicatorio_activo(self, status, id_lineamiento):
        if not status:
            return None
        return self.modelo.get_comunicatorio_lineamiento(status, id_lineamiento)
    
    def buscar_comunicatorio(self, id):
        if not id:
            return None
        return self.modelo.get_comunicatorio(id)

    def crear_comunicatorio(self, datos):
        numero = random.randint(10**4, 10**12 - 1)
        datos["codigo"] = numero

        datos["fecha"] = date.today().strftime('%Y-%m-%d')
        valores = [
            datos['codigo'],
            datos['id_lineamiento'],
            datos['departamento'],
            datos['tipo'],
            datos['prioridad'],
            datos['fecha'],
            datos['descripcion'],
            1
        ]
        retorno = self.modelo.create_comunicatorio(valores)

        ahora = date.today()

        if retorno is not None:

            #Creacion de Registro en la auditoria
            valores = [
                #cedula o id del usuario datos['codigo'],
                ahora.strftime("%H:%M:%S"),
                ahora.strftime('%Y-%m-%d'),
                "Creacion de Comunicatorio",
                f"Se Creo un Comunicatorio con el id: {datos['codigo']}"
            ]
            self.auditoria.create_auditoria(valores)

            return {"status": True, "mensaje": f"Registro creado id: {datos['codigo']}" }
        
        else:

            return {"status": False, "mensaje": "No se pudo guardar el registro"}
    
    def Toggle_comunicatorio(self, datos):
        valores = [
            datos['status'],
            datos['id_departamento']
        ]
        retorno = self.modelo.status_comunicatorio(valores)

        if retorno is not None:

            return {"status": True, "mensaje": "se cambio el estado al departamento de id: " + datos['id_departamento']}
        
        else:

            return {"status": False, "mensaje": "No se pudo guardar el registro"}

    def Edit_comunicatorio(self, datos):
        valores = [
            datos['codigo'],
            datos['nombre'],
            datos['descripcion'],
            datos['ubicacion'],
            datos['created']
        ]
        retorno = self.modelo.update_comunicatorio(valores)

        if retorno is not None:

            return {"status": True, "mensaje": "se edito el departamento de id: " + datos['created']}
        
        else:

            return {"status": False, "mensaje": "No se pudo guardar el registro"}
        