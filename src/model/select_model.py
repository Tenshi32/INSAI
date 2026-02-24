
from model.db_connect import DbConnect

class SelectModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)


    def get_select(self, col1, col2, tabla):
        # Creamos un cursor nuevo para esta petición específica
        cursor = self.conn.cursor(dictionary=True) 
        try:
            sql = f"SELECT {col1}, {col2} FROM {tabla}"
            cursor.execute(sql)
            rows = cursor.fetchall()
            return rows
        except Exception as e:
            print(f"Error en la consulta: {e}")
            return []
        finally:
            # Cerramos solo este cursor
            cursor.close()
        
    def get_select_where(self, col1, col2, col3, tabla, id):
        sql = f"SELECT {col1}, {col2}, {col3} FROM {tabla} WHERE {col3} = {id}"
        self.cursor.execute(sql)

        rows = self.cursor.fetchall()
        return rows
 