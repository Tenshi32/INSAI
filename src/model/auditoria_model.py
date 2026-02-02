from model.db_connect import DbConnect


class AuditoriaModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)


    def get_auditoria(self, id):
        sql = "SELECT a.id_auditoria, a.id_data, a.hora, a.fecha, a.accion, a.descripcion, " \
        "u.id_usuario, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido " \
        "FROM auditoria a JOIN usuarios u ON a.id_data = u.id_usuario " \
        "WHERE a.id_data = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row
 
    def get_all_full_auditoria(self):
        sql =(
                "SELECT "
                "a.id_auditoria, "
                "DATE_FORMAT(a.hora, '%H:%i:%s') as hora, "
                "DATE_FORMAT(a.fecha, '%Y-%m-%d') as fecha, "
                "a.accion, "
                "a.descripcion, "
                "u.nombre AS usuario_nombre, "
                "u.apellido AS usuario_apellido "
                "FROM auditoria a "
                "JOIN usuario_data ua ON a.id_data = ua.id_data "
                "JOIN usuarios u ON ua.id_usuario = u.id_usuario "
                "ORDER BY a.fecha DESC, a.hora DESC"
            )
        
        try:
            self.cursor.execute(sql)
            all_auditoria = self.cursor.fetchall()
            return all_auditoria
        
        except Exception as e:
            print(f"Error al obtener todas las auditorías: {e}")
            return []

    def create_auditoria (self, datos):
        sql = "INSERT INTO auditoria (id_data, hora, fecha, accion, descripcion) " \
        "VALUES (%s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
