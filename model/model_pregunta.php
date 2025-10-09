<?php 

class PreguntaModelo {

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
     * Get a single pregunta by id.
     * Accepts either a single id or an array compatible with execute().
     */
    function getUsuario($id) {
        $get = $this->pdo->prepare("SELECT * FROM pregunta WHERE id_pregunta = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Create a pregunta. Returns the new inserted id on success, or false on failure.
     */
    function createUsuario($datos) {
        $create = $this->pdo->prepare("INSERT INTO pregunta (id_pregunta, pregunta1, repuesta1, pregunta2, repuesta2, pregunta3, repuesta3) 
        VALUES (?, ?, ?, ?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

    /**
     * Update pregunta. Expects [nombre, email, id]. Returns number of affected rows.
     */
    function updateUsuario($datos) {
        $update = $this->pdo->prepare("UPDATE pregunta SET pregunta1 = ?, repuesta1 = ? pregunta2 = ?, repuesta2 = ? pregunta3 = ?, repuesta3 = ? 
        WHERE id_pregunta = ?");
        $update->execute($datos);
        return $update->rowCount();
    }

}

?>