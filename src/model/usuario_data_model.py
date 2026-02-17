
from model.db_connect import DbConnect
import bcrypt

class UsuarioDataModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)

    def get_all_suario_data(self):
        sql = "SELECT ud.*, u.*, s.* FROM usuario_data ud "\
              "INNER JOIN usuarios u ON ud.id_usuario = u.id_usuario " \
              "INNER JOIN seguridad s ON ud.id_seguridad = s.id_seguridad"
        self.cursor.execute(sql)

        all = self.cursor.fetchall()
        return all
    
    def get_usuario_data(self, id):
        sql = "SELECT * FROM usuario_data ud" \
        "INNER JOIN departamentos d ON d.id_departamento = ud.id_departamento " \
        "WHERE ud.id_usuario = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row
    
    def get_cont_fail_plus(self, user):
        sql = "UPDATE seguridad SET cont_fail = cont_fail + 1 " \
        "WHERE id_seguridad = %s"
        self.cursor.execute(sql, (user["id_seguridad"],))
        self.conn.commit()
        return {"statu": False, "cont_fail": user["cont_fail"]+1}

    
    def get_cont_fail_reset(self, user):
        sql = "UPDATE seguridad SET cont_fail = 0 " \
        "WHERE id_seguridad = %s"
        self.cursor.execute(sql, (user["id_seguridad"],))
        self.conn.commit()
        return user
    
    def get_toggle_usuario(self, user):
        sql = "UPDATE usuarios SET statu = '0' " \
        "WHERE id_usuario = %s"
        self.cursor.execute(sql, (user["id_usuario"],))
        self.conn.commit()
        return False
 
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
    
    def verificar_contrasena(self, contrasena_ingresada, hash_almacenado):

        # 1. Convertir la contraseña ingresada a bytes
        contrasena_bytes = contrasena_ingresada.encode('utf-8')
    
        # 2. bcrypt.checkpw hace la comparación. Es seguro contra ataques de tiempo.
        return bcrypt.checkpw(contrasena_bytes, hash_almacenado)

    def login_full(self, datos):

        sql = "SELECT ud.*, u.*, s.*, d.*, n.*, " \
              "u.nombre AS usuario_nombre, n.nombre AS nivel_nombre, d.nombre AS departamento_nombre " \
              "FROM usuario_data ud "\
              "INNER JOIN usuarios u ON ud.id_usuario = u.id_usuario " \
              "INNER JOIN nivel n ON ud.id_nivel = n.id_nivel " \
              "INNER JOIN departamentos d ON ud.id_departamento = d.id_departamento " \
              "INNER JOIN seguridad s ON ud.id_seguridad = s.id_seguridad " \
              "WHERE (u.email = %s OR s.usuario = %s)"
        
        self.cursor.execute(sql, (datos[0],datos[0]))
        user = self.cursor.fetchone()

        if user :

            if  self.verificar_contrasena(datos[1], user['passwrd'].encode('utf-8')):
               
                return self.get_cont_fail_reset(user)

            else:

                if user["cont_fail"] <= 2 :
                    return self.get_cont_fail_plus(user)
                
                elif user["cont_fail"] >= 3:
                    return user
                
                else:
                    return self.get_toggle_usuario(user)
                
        else:
            return None