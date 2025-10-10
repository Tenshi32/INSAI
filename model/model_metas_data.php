<?php 

class MetasDataModelo {

    private $db;
    private $pdo;

    /**
     * Constructor. If a PDO instance is provided it will be used (useful for tests).
     * Otherwise it will require the project's Bd_conect and create a PDO connection.
     *
     * @param PDO|null $pdo
     */
    function __construct($pdo = null) {
        if ($pdo instanceof PDO) {
            $this->pdo = $pdo;
            return;
        }

        require_once __DIR__ . '/bd_conect.php';
        $this->db = new Bd_conect();
        $this->pdo = $this->db->connect();
    }

    /**
     * Get a single cabecera by id.
     * Accepts either a single id or an array compatible with execute().
     */
    function getMetasData($id) {
        $get = $this->pdo->prepare("SELECT * FROM metas_data WHERE id_meta = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    function getMetasFull($id) {
        $get = $this->pdo->prepare("SELECT md.*, m.nombre_meta, o.nombre AS observado, cd.id_lineamiento, cd.id_departamento, cd.id_tipo_poa, u.nombre AS ubicacion
        FROM metas_data md
        JOIN metas m ON md.id_meta = m.id_meta
        JOIN observados o ON md.id_observado = o.id_observado
        JOIN cabeceras_data cd ON md.id_cabecera_data = cd.id_cabecera
        JOIN ubicaciones u ON md.id_ubicacion = u.id_ubicacion
        WHERE md.id_meta = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all data metas as an array.
     */
    function getAllMetasData() {
        $get_all = $this->pdo->prepare("SELECT * FROM metas_data ");
        $get_all->execute();

        return $get_all->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a data metas. Returns the new inserted id on success, or false on failure.
     */
    function createMetasData($datos) {
        $create = $this->pdo->prepare("INSERT INTO metas_data (id_meta, id_observado, id_cabecera_data, id_ubicacion) 
        VALUES (?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

}

?>