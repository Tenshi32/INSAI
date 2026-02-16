from model.db_connect import DbConnect

class LineamientoModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)


    def get_lineamiento(self, id):
        sql = "SELECT * FROM lineaminetos WHERE id_lineamientos = %s LIMIT 1"
        self.cursor.execute(sql, (id,))

        row = self.cursor.fetchone()
        return row
    
    def lineamiento_active(self, status):
        sql = "SELECT * FROM lineamientos WHERE status = %s LIMIT 1"
        self.cursor.execute(sql, (status,))

        row = self.cursor.fetchone()
        return row
 

    def get_all_lineamiento(self):
        sql = "SELECT * FROM lineamientos " \
        "INNER JOIN periodos ON periodos.id_lineamiento = lineamientos.id_lineamiento " \
        "ORDER BY lineamientos.id_lineamiento DESC"
        self.cursor.execute(sql)

        all_usuarios = self.cursor.fetchall()
        return all_usuarios

    def create_lineamiento(self, datos):
        sql = "INSERT INTO lineamientos (id_lineamiento, normas_legales, enfoque_estrategico, lineamientos, metas_alcanzar, fecha_carga) " \
        "VALUES (%s, %s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def update_lineamiento(self, datos):
        sql = "UPDATE lineaminetos SET normas_legales = %s, enfoque_estrategico = %s, lineamientos = %s, fecha_carga = %s " \
        "WHERE id_lineamiento = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
