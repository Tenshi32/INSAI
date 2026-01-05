from db_connect import DbConnect

class ComunicatorioModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)

    def get_comunicatorio(self, id):
        sql = "SELECT c.*, l.* FROM comunicatorios c "\
              "JOIN lineamientos l ON c.id_lineamiento = l.id_lineamiento "\
              "WHERE id_comunicatorio = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row
    
    def get_full_comunicatorio(self, id):
        sql = "SELECT c.*, l.* FROM comunicatorios c "\
              "JOIN lineamientos l ON c.id_lineamiento = l.id_lineamiento "\
              "ORDER BY c.id_comunicatorio DESC"
        self.cursor.execute(sql, (id))
        rows = self.cursor.fetchall()
        return rows

    def create_comunicatorio(self, datos):
        sql = "INSERT INTO comunicatorios (id_comunicatorio, id_lineamiento, fecha_carga, descripcion) " \
        "VALUES (%s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def update_comunicatorio(self, datos):
        sql = "UPDATE comunicatorios SET fecha_carga = %s, descripcion = %s " \
        "WHERE id_comunicatorio = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def delete_comunicatorio(self, id):
        sql = "DELETE FROM comunicatorios WHERE id_comunicatorio = %s"
        try: 
            self.cursor.execute(sql, (id))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
