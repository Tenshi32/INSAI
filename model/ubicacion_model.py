from db_connect import DbConnect

class UbicacionModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)

    def create_ubicacion(self, datos):
        sql = "INSERT INTO ubicaciones (id_ubicacion, id_estado, id_municipio, estado_sede, municipio_sede) " \
        "VALUES (%s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def update_ubicacion(self, datos):
        sql = "UPDATE ubicaciones SET id_estado = %s, id_municipio = %s, estado_sede = %s, municipio_sede = %s " \
        "WHERE id_ubicacion = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
