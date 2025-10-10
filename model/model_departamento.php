<?php 

class DepartamentoModelo {

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
     * Get a single departamento by id.
     * Accepts either a single id or an array compatible with execute().
     */
    function getDepartamento($id) {
        $get = $this->pdo->prepare("SELECT * FROM departamentos WHERE id_departamento = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Create a departamento. Returns the new inserted id on success, or false on failure.
     */
    function createDepartamento($datos) {
        $create = $this->pdo->prepare("INSERT INTO departamentos (id_departamento, nombre, descripcion) 
        VALUES (?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

    /**
     * Update departamento. Returns number of affected rows.
     */
    function updateDepartamento($datos) {
        $update = $this->pdo->prepare("UPDATE departamentos SET nombre = ?, descripcion = ? 
        WHERE id_departamento = ?");
        $update->execute($datos);
        return $update->rowCount();
    }

}

?>