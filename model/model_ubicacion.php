<?php 

class UbicacionModelo {

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
     * Create a ubicacion. Returns the new inserted id on success, or false on failure.
     */
    function createUbicacion($datos) {
        $create = $this->pdo->prepare("INSERT INTO ubicaciones (id_ubicacion, id_estado, id_municipio, estado_sede, municipio_sede) 
        VALUES (?, ?, ?, ?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

    /**
     * Update ubicacion. Expects [nombre, email, id]. Returns number of affected rows.
     */
    function updateUbicacion($datos) {
        $update = $this->pdo->prepare("UPDATE ubicaciones SET id_estado = ?, id_municipio = ?, estado_sede = ?, municipio_sede = ? WHERE id_ubicacion = ?");
        $update->execute($datos);
        return $update->rowCount();
    }

}

?>