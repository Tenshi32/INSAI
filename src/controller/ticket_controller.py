from model.ticket_model import TicketModel
from datetime import datetime
import random


class TicketController:

    def __init__(self):
        self.modelo = TicketModel()

    def listar(self):
        return self.modelo.get_all_ticket()

    def obtener(self, id_ticket):
        if not id_ticket:
            return None
        return self.modelo.get_ticket(id_ticket)

    def crear(self, datos: dict):
        if 'id_ticket' not in datos:
            datos['id_ticket'] = str(random.randint(10**5, 10**10 - 1))

        valores = [
            datos.get('id_data'),
            datos.get('hora'),
            datos.get('fecha'),
            datos.get('accion'),
            datos.get('descripcion'),
            datos.get('statu', 1)
        ]

        retorno = self.modelo.create_ticket(valores)

        if retorno is not None:
            return {"status": True, "mensaje": f"Ticket creado id: {retorno}"}
        return {"status": False, "mensaje": "No se pudo crear el ticket"}

    def editar(self, datos: dict):
        valores = [
            datos.get('id_data')
        ]

        retorno = self.modelo.update_ticket(valores)

        if retorno is not None:
            return {"status": True, "mensaje": "Ticket actualizado"}
        return {"status": False, "mensaje": "No se pudo actualizar el ticket"}
