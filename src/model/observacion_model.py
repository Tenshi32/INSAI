from model.db_connect import DbConnect

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
    
    def get_observacion_planificacion(self, id):
        sql = "SELECT * FROM observaciones o " \
        "JOIN cabeceras_data cd ON cd.id_observado = o.id_observacion "\
        "JOIN lineamientos l ON cd.id_lineamiento = l.id_lineamiento "\
        "JOIN cabeceras c ON cd.id_cabecera = c.id_cabecera "\
        "JOIN departamentos d ON cd.id_departamento = d.id_departamento "\
        "JOIN tipo_poa tp ON cd.id_tipo_poa = tp.id_tipo_poa " \
        "WHERE cd.id_departamento = %s"
        self.cursor.execute(sql, (id, ))

        row = self.cursor.fetchall()
        return row

    def create_observacion(self, datos):
        sql = "INSERT INTO observaciones (id_observacion, observacion, fecha_create, statu) " \
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
