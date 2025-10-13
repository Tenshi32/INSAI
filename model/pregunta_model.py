from db_connect import DbConnect

class PreguntaModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)


    def get_pregunta(self, id):
        sql = "SELECT * FROM pregunta WHERE id_pregunta = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row
 
    def create_pregunta(self, datos):
        sql = "INSERT INTO pregunta (id_pregunta, pregunta1, repuesta1, pregunta2, repuesta2, pregunta3, repuesta3) " \
        "VALUES (%s, %s, %s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def update_pregunta(self, datos):
        sql = "UPDATE pregunta SET pregunta1 = %s, repuesta1 = %s, pregunta2 = %s, repuesta2 = %s, pregunta3 = %s, repuesta3 = %s " \
        "WHERE id_pregunta = %s"
        
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None