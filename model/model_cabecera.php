<?php 

class CabeceraModelo {

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
    function getCabecera($id) {
        $get = $this->pdo->prepare("SELECT * FROM cabeceras WHERE id_cabecera = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all cabecera as an array.
     */
    function getAllCabecera() {
        $get_all = $this->pdo->prepare("SELECT * FROM cabeceras");
        $get_all->execute();

        return $get_all->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a cabecera. Returns the new inserted id on success, or false on failure.
     */
    function createCabecera($datos) {
        $create = $this->pdo->prepare("INSERT INTO cabeceras (id_cabecera, proyecto, enfoque_estrategico, sector, objetivos, actividad) 
        VALUES (?, ?, ?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

    /**
     * Update cabecera. Expects [nombre, email, id]. Returns number of affected rows.
     */
    function updateCabecera($datos) {
        $update = $this->pdo->prepare("UPDATE cabeceras SET proyecto = ?, enfoque_estrategico = ?, sector = ?, objetivos = ?, actividad = ? 
        WHERE id_cabecera = ?");
        $update->execute($datos);
        return $update->rowCount();
    }

}

?>