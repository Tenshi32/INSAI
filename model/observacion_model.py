from db_connect import DbConnect

class ObservacionModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)

    def get_observacion(self, id):
        sql = "SELECT * FROM observaciones WHERE id_observacion = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row

    def create_observacion(self, datos):
        sql = "INSERT INTO observaciones (id_observacion, id_observado, observacion, statu) " \
        "VALUES (%s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def update_observacion(self, datos):
        sql = "UPDATE observaciones SET observacion = %s WHERE id_observacion = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
        
    def update_statu(self, datos):
        sql = "UPDATE observaciones SET statu = 1 WHERE id_observacion = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
