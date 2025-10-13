from db_connect import DbConnect


class CabeceraDataModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)

    def get_cabecera_data(self, id):
        sql = "SELECT cd.*, l.*, d.*, o.*, tp.* FROM cabeceras_data cd "\
              "JOIN lineaminetos l ON cd.id_lineamiento = l.id_lineamiento "\
              "JOIN departamentos d ON cd.id_departamento = d.id_departamento "\
              "JOIN observado o ON cd.id_observado = o.id_observado "\
              "JOIN tipo_poa tp ON cd.id_tipo_poa = tp.id_tipo_poa "\
              "WHERE id_cabecera = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row
    
    def get_full_cabecera_data(self, id):
        sql = "SELECT cd.*, l.*, d.*, o.*, tp.* FROM cabeceras_data cd "\
              "JOIN lineaminetos l ON cd.id_lineamiento = l.id_lineamiento "\
              "JOIN departamentos d ON cd.id_departamento = d.id_departamento "\
              "JOIN observado o ON cd.id_observado = o.id_observado "\
              "JOIN tipo_poa tp ON cd.id_tipo_poa = tp.id_tipo_poa " \
              "ORDER BY cd.id_cabecera DESC"
        self.cursor.execute(sql)
        all_cabeceras = self.cursor.fetchall()
        return all_cabeceras
 
    def create_cabecera_data(self, datos):
        sql = "INSERT INTO cabeceras_data (id_cabecera, id_lineamiento, id_departamento, id_observado, id_tipo_poa) " \
        "VALUES (%s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
    