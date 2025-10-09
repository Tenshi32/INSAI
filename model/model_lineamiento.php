<?php 

class LineamientoModelo {

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
    function getLineamiento($id) {
        $get = $this->pdo->prepare("SELECT * FROM lineaminetos WHERE id_lineamiento = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all lineamiento as an array.
     */
    function getAllLineamiento() {
        $get_all = $this->pdo->prepare("SELECT * FROM lineaminetos ");
        $get_all->execute();

        return $get_all->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a lineamiento. Returns the new inserted id on success, or false on failure.
     */
    function createLineamiento($datos) {
        $create = $this->pdo->prepare("INSERT INTO lineaminetos (id_lineamiento, normas_legales, enfoque_estrategico, lineamientos, fecha_carga) 
        VALUES (?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

    /**
     * Update lineamiento. Expects [nombre, email, id]. Returns number of affected rows.
     */
    function updateLineamiento($datos) {
        $update = $this->pdo->prepare("UPDATE lineaminetos SET normas_legales = ?, enfoque_estrategico = ?, lineamientos = ?, fecha_carga = ? 
        WHERE id_lineamiento = ?");
        $update->execute($datos);
        return $update->rowCount();
    }

}

?>