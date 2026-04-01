from model import ObservacionModel, CabeceraDataModel, MetasDataModel, ComprobanteDataModel
from datetime import date
import random



class ObservacionController:

    def __init__(self):
        self.modelo = ObservacionModel()
        self.modeloPlanificacion = CabeceraDataModel()
        self.modeloFormulacion = MetasDataModel()
        self.modeloComprobante = ComprobanteDataModel()

    def listar(self):
        return self.modelo.get_all_ticket()
    
    def listar_planificacion(self, id_departamento):
        if not id_departamento:
            return None
        return self.modelo.get_observacion_planificacion(id_departamento)

    def obtener(self, id_ticket):
        if not id_ticket:
            return None
        return self.modelo.get_ticket(id_ticket)

    def crear(self, datos: dict):
        if 'id_observacion' not in datos:
            datos['id_observacion'] = str(random.randint(10**5, 10**10 - 1))

        estados = {
            'planificacion': self.modeloPlanificacion,
            'formulacion': self.modeloFormulacion,
            'comprobante': self.modeloComprobante
        }

        datos["fecha_create"] = date.today().strftime('%Y-%m-%d')
        valores = [
            datos.get('id_observacion'),
            datos.get('observacion'),
            datos.get('fecha_create'),
            '0',
        ]

        retorno = self.modelo.create_observacion(valores)

        valores = [
            datos.get('id_observacion'),
            datos.get('id_observado'),
        ]
        retorno = estados[datos['tipo_observacion']].update_observacion(valores)

        if retorno is not None:
            return {"status": True, "mensaje": f"Observacion enviada"}
        return {"status": False, "mensaje": "No se pudo enviar la observacion"}

    def editar(self, datos: dict):
        valores = [
            datos.get('id_data')
        ]

        retorno = self.modelo.update_ticket(valores)

        if retorno is not None:
            return {"status": True, "mensaje": "Ticket actualizado"}
        return {"status": False, "mensaje": "No se pudo actualizar el ticket"}
