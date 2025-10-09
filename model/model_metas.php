<?php 

class MetasModelo {

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
    function getMetas($id) {
        $get = $this->pdo->prepare("SELECT * FROM metas_fisicas  WHERE id_meta = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all metas as an array.
     */
    function getAllMetas() {
        $get_all = $this->pdo->prepare("SELECT * FROM metas_fisicas ");
        $get_all->execute();

        return $get_all->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a metas. Returns the new inserted id on success, or false on failure.
     */
    function createMetas($datos) {
        $create = $this->pdo->prepare("INSERT INTO metas_fisicas (id_meta, acciones, distribucion_trimestre, actividad_trimestr, total_actividad, descripcion) 
        VALUES (?, ?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

    /**
     * Update metas. Expects [nombre, email, id]. Returns number of affected rows.
     */
    function updateMetas($datos) {
        $update = $this->pdo->prepare("UPDATE metas_fisicas SET acciones = ?, distribucion_trimestre = ?, actividad_trimestr = ?, total_actividad = ?, descripcion = ? 
        WHERE id_meta = ?");
        $update->execute($datos);
        return $update->rowCount();
    }

}

?>