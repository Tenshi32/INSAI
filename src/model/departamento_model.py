from model.db_connect import DbConnect

class DepartamentoModel:

    def __init__(self):
        # Defer opening the DB connection until needed to avoid failures at import time
        self.conn = None
        self.cursor = None

    def _ensure_connection(self):
        if self.conn is None:
            self.conn = DbConnect().connect()
            if self.conn is None:
                return False
            self.cursor = self.conn.cursor(dictionary=True)
        return True

    def get_departamento(self, id):
        if not self._ensure_connection():
            print("Database connection unavailable.")
            return None

        sql = "SELECT * FROM departamentos WHERE id_departamento = %s"
        self.cursor.execute(sql, (id,))

        row = self.cursor.fetchone()
        return row

    def gets_departamentos(self):
        if not self._ensure_connection():
            print("Database connection unavailable.")
            return None

        sql = "SELECT * FROM departamentos"
        self.cursor.execute(sql)

        rows = self.cursor.fetchall()
        return rows

    def create_departamento(self, datos):
        if not self._ensure_connection():
            print("Database connection unavailable.")
            return None

        sql = "INSERT INTO departamentos (id_departamento, nombre, descripcion, ubicacion) " \
              "VALUES (%s, %s, %s, %s)"

        try:

            # `datos` is expected to be an iterable matching the placeholders
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

    def update_departamento(self, datos):
        if not self._ensure_connection():
            print("Database connection unavailable.")
            return None

        sql = "UPDATE departamentos SET id_departamento = %s, nombre = %s, descripcion = %s, ubicacion = %s " \
              "WHERE id_departamento = %s"

        try:
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
        
    def status_departamento(self, datos):
        if not self._ensure_connection():
            print("Database connection unavailable.")
            return None

        sql = "UPDATE departamentos SET status = %s" \
              "WHERE id_departamento = %s"

        try:
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.rowcount

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None

# Note: do not instantiate a global model here to avoid connecting at import time.