<?php 

class ObservacionModelo {

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
     * Get a single observacion by id.
     * Accepts either a single id or an array compatible with execute().
     */
    function getObservacion($id) {
        $get = $this->pdo->prepare("SELECT * FROM observaciones WHERE id_observacion = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * Create a observacion. Returns the new inserted id on success, or false on failure.
     */
    function createObservacion($datos) {
        $create = $this->pdo->prepare("INSERT INTO observaciones (id_observacion, id_observado, observacion, statu) 
        VALUES (?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

    /**
     * Update observacion. Returns number of affected rows.
     */
    function updateObservacion($datos) {
        $update = $this->pdo->prepare("UPDATE observaciones SET observacion = ?, descripcion = ?
        WHERE id_observacion = ?");
        $update->execute($datos);
        return $update->rowCount();
    }

}

?>