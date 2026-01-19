from model.nivel_model import NivelesModel

class NivelController:

    def __init__(self):
        # Instantiate the model here (lazy DB connection inside model)
        self.modelo = NivelesModel()


    def buscar_nivel(self):
        return self.modelo.gets_niveles()

    def buscar_departamento(self, id):
        if not id:
            return None
        return self.modelo.get_departamento(id)

    def crear_departamento(self, datos):
        valores = [
            datos['codigo'],
            datos['nombre'],
            datos['ubicacion'],
            datos['descripcion']
        ]
        retorno = self.modelo.create_departamento(valores)

        if retorno is not None:

            return {"status": True, "mensaje": "Registro creado id: " + datos['codigo']}
        
        else:

            return {"status": False, "mensaje": "No se pudo guardar el registro"}
    
    def Toggle_departamento(self, datos):
        valores = [
            datos['status'],
            datos['id_departamento']
        ]
        retorno = self.modelo.status_departamento(valores)

        if retorno is not None:

            return {"status": True, "mensaje": "se cambio el estado al departamento de id: " + datos['id_departamento']}
        
        else:

            return {"status": False, "mensaje": "No se pudo guardar el registro"}


    def Edit_departamento(self, datos):
        valores = [
            datos['codigo'],
            datos['nombre'],
            datos['descripcion'],
            datos['ubicacion'],
            datos['created']
        ]
        retorno = self.modelo.update_departamento(valores)

        if retorno is not None:

            return {"status": True, "mensaje": "se edito el departamento de id: " + datos['created']}
        
        else:

            return {"status": False, "mensaje": "No se pudo guardar el registro"}
        