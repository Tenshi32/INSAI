from db_connect import DbConnect

class DepartamentoModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)


    def get_departamento(self, id):
        sql = "SELECT * FROM departamentos WHERE id_departamento = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row

    def create_departamento(self, datos):
        sql = "INSERT INTO departamentos (id_departamento, nombre, descripcion) " \
        "VALUES (%s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

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
