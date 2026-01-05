from db_connect import DbConnect


class ComprobanteDataModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)

    def get_comprobante_data(self, id):
        sql = "SELECT cd.*, c.ruta_carpeta, c.descripcion, o.nombre AS observado, m.nombre_meta" \
              "FROM comprobantes_data cd " \
              "JOIN comprobantes c ON cd.id_comprobante = c.id_comprobante " \
              "JOIN observados o ON cd.id_observado = o.id_observado " \
              "JOIN metas m ON cd.id_metas = m.id_meta " \
              "WHERE cd.id_comprobante = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row
    
    def get_full_comprobante_data(self, id):
        sql = "SELECT cd.*, c.ruta_carpeta, c.descripcion, o.nombre AS observado, m.nombre_meta" \
              "FROM comprobantes_data cd " \
              "JOIN comprobantes c ON cd.id_comprobante = c.id_comprobante " \
              "JOIN observados o ON cd.id_observado = o.id_observado " \
              "JOIN metas m ON cd.id_metas = m.id_meta " \
              "ORDER BY cd.id_comprobante DESC"
        self.cursor.execute(sql)
        all_cabeceras = self.cursor.fetchall()
        return all_cabeceras
 
    def create_comprobante_data(self, datos):
        sql = "INSERT INTO comprobantes_data (id_comprobante, id_observado, id_metas) " \
        "VALUES (%s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
    