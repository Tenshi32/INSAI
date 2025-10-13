from db_connect import DbConnect
import bcrypt

class SeguridadModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)

    def get_seguridad(self, id):
        sql = "SELECT * FROM seguridad WHERE id_seguridad = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row

    def hashear_contrasena(self, contrasena):
        contrasena_bytes = contrasena.encode('utf-8')

        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(contrasena_bytes, salt)
        return hashed_password

    def create_seguridad(self, datos):

        datos[2] = self.hashear_contrasena(datos[2])

        sql = "INSERT INTO seguridad (id_seguridad, usuario, passwrd, ruta_foto, cont_fail, token, remember) " \
        "VALUES (%s, %s, %s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def update_seguridad(self, datos):
        sql = "UPDATE seguridad SET ruta_foto = %s, usuario = %s WHERE id_seguridad = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def delete_usuario(self, id):
        sql = "DELETE FROM seguridad WHERE id_seguridad = %s"
        try: 
            self.cursor.execute(sql, (id))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def remember_me(self, datos):
        sql = "UPDATE seguridad SET remember = %s WHERE id_seguridad = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
    
    def update_password(self, datos):
        datos[1] = self.hashear_contrasena(datos[1])

        sql = "UPDATE seguridad SET passwrd = %s WHERE id_seguridad = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
    
    def incrementar_fallos(self, id):
        sql = "UPDATE seguridad SET cont_fail = cont_fail + 1 WHERE id_seguridad = %s"
        
        try: 
            self.cursor.execute(sql, (id))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
    
    def resetear_fallos(self, id):
        sql = "UPDATE seguridad SET cont_fail = 0 WHERE id_seguridad = %s"
        
        try: 
            self.cursor.execute(sql, (id))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None