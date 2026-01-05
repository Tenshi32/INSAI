from db_connect import DbConnect
import bcrypt

class UsuarioDataModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)

    def get_usuario_data(self, id):
        sql = "SELECT * FROM usuario_data WHERE id_usuario = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row
 
    def create_usuario_data(self, datos):
        sql = "INSERT INTO usuario_data (id_usuario, id_seguridad, id_pregunta, id_departamento, id_nivel) " \
        "VALUES (%s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
    
    def verificar_contrasena(self, contrasena_ingresada, hash_almacenado) -> bool:

        # 1. Convertir la contraseña ingresada a bytes
        contrasena_bytes = contrasena_ingresada.encode('utf-8')
    
        # 2. bcrypt.checkpw hace la comparación. Es seguro contra ataques de tiempo.
        return bcrypt.checkpw(contrasena_bytes, hash_almacenado)

    def login_full(self, datos):
        sql = "SELECT ud.*, u.*, s.* FROM usuario_data ud "\
              "JOIN usuarios u ON ud.id_usuario = u.id_usuario " \
              "JOIN seguridad s ON ud.id_seguridad = s.id_seguridad " \
              "WHERE u.email = %s"
        self.cursor.execute(sql, (datos[0],))
        user = self.cursor.fetchone()

        if user and self.verificar_contrasena(datos[1], user['password'].encode('utf-8')):
            return user
        else:
            return None