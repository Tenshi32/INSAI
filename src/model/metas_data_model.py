from model.db_connect import DbConnect


class MetasDataModel:

    def __init__(self):
        self.conn = DbConnect().connect()

        if self.conn is None:
            raise ConnectionError("No se pudo establecer la conexión a la base de datos.")

        self.cursor = self.conn.cursor(dictionary=True)

    def get_metas_data(self, id):
        sql = "SELECT md.*, m.nombre_meta, o.nombre AS observacion, cd.id_lineamiento, cd.id_departamento, cd.id_tipo_poa, u.nombre AS ubicacion" \
              "FROM metas_data md JOIN metas m ON md.id_meta = m.id_meta JOIN observaciones o ON md.id_observado = o.id_observado " \
              "JOIN cabeceras_data cd ON md.id_cabecera_data = cd.id_cabecera " \
              "JOIN metas m ON cd.id_metas = m.id_meta JOIN ubicaciones u ON md.id_ubicacion = u.id_ubicacion " \
              "WHERE md.id_meta = %s"
        self.cursor.execute(sql, (id))

        row = self.cursor.fetchone()
        return row
    
    def get_formulacion_x_planificacion(self, id):
        sql = "SELECT mf.*, u.sede_ubicacion, md.id_meta_data, e.estado, m.municipio, md.id_cabecera_data " \
            "FROM metas_data md " \
            "JOIN metas_fisicas mf ON md.id_meta = mf.id_meta " \
            "JOIN observaciones o ON md.id_observado = o.id_observacion " \
            "JOIN cabeceras_data cd ON md.id_cabecera_data = cd.id_cabecera " \
            "JOIN ubicaciones u ON md.id_ubicacion = u.id_ubicacion " \
            "JOIN estados e ON u.id_estado = e.id_estado " \
            "JOIN municipios m ON u.id_municipio = m.id_municipio " \
            "WHERE cd.id_cabecera = %s"
        self.cursor.execute(sql, (id, ))

        row = self.cursor.fetchall()
        return row
    
    def get_full_metas_data(self, id):
        sql = "SELECT md.*, m.nombre_meta, o.nombre AS observacion, cd.id_lineamiento, cd.id_departamento, cd.id_tipo_poa, u.nombre AS ubicacion" \
              "FROM metas_data md JOIN metas m ON md.id_meta = m.id_meta JOIN observaciones o ON md.id_observado = o.id_observado " \
              "JOIN cabeceras_data cd ON md.id_cabecera_data = cd.id_cabecera " \
              "JOIN metas m ON cd.id_metas = m.id_meta JOIN ubicaciones u ON md.id_ubicacion = u.id_ubicacion " \
              "ORDER BY md.id_meta DESC"
        self.cursor.execute(sql)
        all_cabeceras = self.cursor.fetchall()
        return all_cabeceras
    
    def get_full_metas_revision(self, id_lineamiento):
        sql = "SELECT mf.*, u.sede_ubicacion, md.id_meta_data, e.estado, m.municipio, md.id_cabecera_data, cd.id_departamento " \
            "FROM metas_data md " \
            "JOIN metas_fisicas mf ON md.id_meta = mf.id_meta " \
            "JOIN observaciones o ON md.id_observado = o.id_observacion " \
            "JOIN cabeceras_data cd ON md.id_cabecera_data = cd.id_cabecera " \
            "JOIN ubicaciones u ON md.id_ubicacion = u.id_ubicacion " \
            "JOIN estados e ON u.id_estado = e.id_estado " \
            "JOIN municipios m ON u.id_municipio = m.id_municipio " \
            "WHERE cd.id_lineamiento = %s ORDER BY mf.id_meta DESC"

        self.cursor.execute(sql, (id_lineamiento,))
        all_cabeceras = self.cursor.fetchall()

        metas_agrupadas = {}
        for meta in all_cabeceras:
            depto = meta['id_departamento'] # O el ID del departamento
            if depto not in metas_agrupadas:
                metas_agrupadas[depto] = []
            metas_agrupadas[depto].append(meta)

        return metas_agrupadas
 
    def create_metas_data(self, datos):
        sql = "INSERT INTO metas_data (id_meta_data, id_meta, id_observado, id_cabecera_data, id_ubicacion) " \
        "VALUES (%s, %s, %s, %s, %s)"
      
        try: 
            self.cursor.execute(sql, tuple(datos))
            self.conn.commit()
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            print(f"Error inesperado: {e}")
            return None
    