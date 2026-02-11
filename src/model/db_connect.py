import mysql.connector
import subprocess
import bcrypt
import os
from dotenv import load_dotenv


class DbConnect:

    def __init__(self):
        load_dotenv()
        self.conn = None
        self.mysql_params = {'host':os.getenv("HOSTDB"),'user':os.getenv("USERDB"),'password':os.getenv("PASSWRDB"),'database':os.getenv("NAMEDB")}

    def connect(self):
        try:
            self.conn = mysql.connector.connect(**self.mysql_params)
            return self.conn
        
        except mysql.connector.Error as e:
            print('MySQL connection failed:', e)
            return None
        
    """Exporta la base de datos a un archivo .sql"""
    def exporte(self, output_file="backup_insai.sql", usuario=None, contrasena=None):
        if usuario and contrasena:
            user = self.login(usuario, contrasena)
            if not user or isinstance(user, dict) and not user.get('status', True):
                return False  # Login fallido
        
        try:
            comando = (
                f"mysqldump -h {self.mysql_params['host']} "
                f"-u {self.mysql_params['user']} "
                f"{self.mysql_params['database']} > {output_file}"
            )
            
            subprocess.run(comando, shell=True, check=True)
            return True
        
        except Exception as e:

            return False
        
    """Importa un archivo .sql a la base de datos"""
    def importe(self, input_file, usuario=None, contrasena=None):
        if usuario and contrasena:
            user = self.login(usuario, contrasena)
            if not user or isinstance(user, dict) and not user.get('status', True):
                return False  # Login fallido
        
        try:
            comando = (
                f"mysql -h {self.mysql_params['host']} "
                f"-u {self.mysql_params['user']} "
                f"{self.mysql_params['database']} < {input_file}"
            )
            
            subprocess.run(comando, shell=True, check=True)
            return True
        
        except Exception as e:

            return False
        
    def verificar_contrasena(self, contrasena_ingresada, hash_almacenado):
        # 1. Convertir la contraseña ingresada a bytes
        contrasena_bytes = contrasena_ingresada.encode('utf-8')
        # 2. bcrypt.checkpw hace la comparación. Es seguro contra ataques de tiempo.
        return bcrypt.checkpw(contrasena_bytes, hash_almacenado)

    def login(self, usuario, contrasena):
        try:
            conn = self.connect()
            if conn is None:
                return None
            cursor = conn.cursor(dictionary=True)
            
            sql = "SELECT ud.*, u.*, s.*, d.*, n.*, " \
                  "u.nombre AS usuario_nombre, n.nombre AS nivel_nombre, d.nombre AS departamento_nombre " \
                  "FROM usuario_data ud " \
                  "INNER JOIN usuarios u ON ud.id_usuario = u.id_usuario " \
                  "INNER JOIN nivel n ON ud.id_nivel = n.id_nivel " \
                  "INNER JOIN departamentos d ON ud.id_departamento = d.id_departamento " \
                  "INNER JOIN seguridad s ON ud.id_seguridad = s.id_seguridad " \
                  "WHERE (u.email = %s OR s.usuario = %s)"
            
            cursor.execute(sql, (usuario, usuario))
            user = cursor.fetchone()
            
            if user:
                if self.verificar_contrasena(contrasena, user['passwrd'].encode('utf-8')):
                    # Reset cont_fail
                    sql_reset = "UPDATE seguridad SET cont_fail = 0 WHERE id_seguridad = %s"
                    cursor.execute(sql_reset, (user["id_seguridad"],))
                    conn.commit()
                    cursor.close()
                    return user
                else:
                    # Increment cont_fail
                    if user["cont_fail"] < 3:
                        sql_inc = "UPDATE seguridad SET cont_fail = cont_fail + 1 WHERE id_seguridad = %s"
                        cursor.execute(sql_inc, (user["id_seguridad"],))
                        conn.commit()
                        cursor.close()
                        return {"status": False, "cont_fail": user["cont_fail"] + 1}
                    else:
                        # Disable user
                        sql_disable = "UPDATE usuarios SET statu = '0' WHERE id_usuario = %s"
                        cursor.execute(sql_disable, (user["id_usuario"],))
                        conn.commit()
                        cursor.close()
                        return False
            else:
                cursor.close()
                return None
        except Exception as e:
            print(f"Error en login: {e}")
            return None