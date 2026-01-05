from src.model.departamento_model import modelo

class DepartamentoController:

    def __init__(self):
        pass

    def get_departamento(self, id):
        sql = "SELECT * FROM departamentos WHERE id_departamento = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row

    def crear_departamento(self, datos):
        modelo = modelo()
        pass

    def update_departamento(self, datos):
        sql = "UPDATE departamentos SET nombre = %s, descripcion = %s " \
        "WHERE id_departamento = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None