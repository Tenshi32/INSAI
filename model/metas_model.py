from db_connect import DbConnect

class MetasModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)

    def create_metas(self, datos):
        sql = "INSERT INTO metas_fisicas (id_meta, acciones, distribucion_trimestre, actividad_trimestre, total_actividad, descripcion) " \
        "VALUES (%s, %s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def update_metas(self, datos):
        sql = "UPDATE metas_fisicas SET acciones = %s, distribucion_trimestre = %s, actividad_trimestre = %s, total_actividad = %s, descripcion = %s" \
        "WHERE id_meta = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None