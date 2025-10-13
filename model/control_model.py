from db_connect import DbConnect

class UsuarioModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)


    def get_usuario(self, id):
        sql = "SELECT co.*, c.ruta_carpeta, c.descripcion FROM controles co "\
              "JOIN comprobantes c ON co.id_comprobante = c.id_comprobante" \
              "WHERE id_control = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row
 

    def get_all_usuarios(self):
        sql = "SELECT co.*, c.ruta_carpeta, c.descripcion FROM controles co "\
              "JOIN comprobantes c ON co.id_comprobante = c.id_comprobante" \
              "ORDER BY co.id_control DESC"
        self.cursor.execute(sql)

        all_usuarios = self.cursor.fetchall()
        return all_usuarios

    def create_usuario(self, datos):
        sql = "INSERT INTO controles (id_control, id_comprobante, puntuacion, observacion, statu) " \
        "VALUES (%s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def update_usuario(self, datos):
        sql = "controles usuarios SET puntuacion = %s, observacion = %s " \
        "WHERE id_control = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def delete_usuario(self, id):
        sql = "DELETE FROM usuarios WHERE id_usuario = %s"
        try: 
            self.cursor.execute(sql, (id))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
