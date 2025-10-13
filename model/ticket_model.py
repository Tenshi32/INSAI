from db_connect import DbConnect

class TicketModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)


    def get_ticket(self, id):
        sql = "SELECT t.id_ticket, t.id_data, t.hora, t.fecha, t.accion, t.descripcion, t.statu," \
        "u.id_usuario, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido " \
        "FROM tickets t JOIN usuarios u ON t.id_data = u.id_usuario " \
        "WHERE t.id_data = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row
 

    def get_all_ticket(self):
        sql = "SELECT t.id_ticket, t.id_data, t.hora, t.fecha, t.accion, t.descripcion, t.statu," \
        "u.id_usuario, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido " \
        "FROM tickets t JOIN usuarios u ON t.id_data = u.id_usuario" \
        "ORDER BY t.id_data DESC"
        self.cursor.execute(sql)

        all_usuarios = self.cursor.fetchall()
        return all_usuarios

    def create_ticket(self, datos):
        sql = "INSERT INTO tickets (id_data, hora, fecha, accion, descripcion, statu) " \
        "VALUES (%s, %s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def update_ticket(self, datos):
        sql = "UPDATE tickets SET statu = 1 WHERE id_data = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
