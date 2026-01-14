from model.db_connect import DbConnect

class UsuarioModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)

    def _ensure_connection(self):
        if self.conn is None:
            self.conn = DbConnect().connect()
            if self.conn is None:
                return False
            self.cursor = self.conn.cursor(dictionary=True)
        return True
    
    def get_usuario(self, id):
        sql = "SELECT * FROM usuarios WHERE id_usuario = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row
 
    def get_all_usuarios(self):
        if not self._ensure_connection():
            print("Database connection unavailable.")
            return None
        
        sql = "SELECT * FROM usuarios"
        self.cursor.execute(sql)

        all_usuarios = self.cursor.fetchall()
        return all_usuarios

    def create_usuario(self, datos):
        if not self._ensure_connection():
            print("Database connection unavailable.")
            return None
        
        sql = "INSERT INTO usuarios (id_usuario, nombre, apellido, fecha_nacimiento, email, telefono, profesion) " \
        "VALUES (%s, %s, %s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def update_usuario(self, datos):
        if not self._ensure_connection():
            print("Database connection unavailable.")
            return None

        sql = "UPDATE usuarios SET id_usuario= %s, nombre= %s, apellido= %s, fecha_nacimiento= %s, email= %s, telefono= %s " \
        "WHERE id_usuario = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
        
    def toggle_usuario(self, datos):
        if not self._ensure_connection():
            print("Database connection unavailable.")
            return None

        sql = "UPDATE usuarios SET statu = %s" \
        " WHERE id_usuario = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

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
