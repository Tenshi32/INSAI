from db_connect import DbConnect

class SelectModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)


    def get_select(self, col1, col2, tabla):
        sql = f"SELECT {col1}, {col2} FROM {tabla}"
        self.cursor.execute(sql)

        rows = self.cursor.fetchall()
        return rows
    
    def get_select_where(self, col1, col2, col3, tabla, id):
        sql = f"SELECT {col1}, {col2}, {col3} FROM {tabla} WHERE {col1} = ?"
        self.cursor.execute(sql, (id))

        rows = self.cursor.fetchall()
        return rows
 