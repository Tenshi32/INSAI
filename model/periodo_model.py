from db_connect import DbConnect

class PeriodoModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)

    def get_periodo(self, id):
        sql = "SELECT p.id_periodo, p.id_lineamiento, l.nombre AS lineamiento, p.rango, p.fecha_inicio, p.fecha_final, p.statu" \
        "FROM periodos p " \
        "JOIN lineamientos l ON p.id_lineamiento = l.id_lineamiento " \
        "WHERE p.id_periodo = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row

    def get_all_periodo(self):
        sql = "SELECT p.id_periodo, p.id_lineamiento, l.nombre AS lineamiento, p.rango, p.fecha_inicio, p.fecha_final, p.statu" \
        "FROM periodos p " \
        "JOIN lineamientos l ON p.id_lineamiento = l.id_lineamiento " \
        "ORDER BY t.id_data DESC"
        self.cursor.execute(sql)

        all_usuarios = self.cursor.fetchall()
        return all_usuarios

    def create_periodo(self, datos):
        sql = "INSERT INTO periodos (id_periodo, id_lineamiento, rango, fecha_inicio, fecha_final, statu) " \
        "VALUES (%s, %s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def update_periodo(self, datos):
        sql = "UPDATE periodos SET rango = %s, fecha_inicio = %s, fecha_final = %s WHERE id_periodo = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
    
    def update_statu(self, datos):
        sql = "UPDATE periodos SET statu = 1 WHERE id_periodo = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
