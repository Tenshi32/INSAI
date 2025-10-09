<?php 

class UsuarioDataModelo {

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
     * Get a single usuario by id.
     * Accepts either a single id or an array compatible with execute().
     */
    function getUsuarioData($id) {
        $get = $this->pdo->prepare("SELECT * FROM usuario_data WHERE id_usuario = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Create a usuario. Returns the new inserted id on success, or false on failure.
     */
    function createUsuarioData($datos) {
        $create = $this->pdo->prepare("INSERT INTO usuario_data (id_usuario, id_seguridad, id_pregunta, id_departamento, id_nivel) 
        VALUES (?, ?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

}

?>