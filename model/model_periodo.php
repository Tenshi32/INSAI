<?php 

class PeriodoModelo {

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
    function getPeriodo($id) {
        $get = $this->pdo->prepare("SELECT * FROM periodos WHERE id_periodo = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    function getPeriodoFull($id) {
        $get = $this->pdo->prepare("SELECT p.id_periodo, p.id_lineamiento, l.nombre AS lineamiento, p.rango, p.fecha_inicio, p.fecha_final, p.statu
        FROM periodos p
        JOIN lineamientos l ON p.id_lineamiento = l.id_lineamiento
        WHERE p.id_periodo = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Create a usuario. Returns the new inserted id on success, or false on failure.
     */
    function createPeriodo($datos) {
        $create = $this->pdo->prepare("INSERT INTO periodos (id_periodo, id_lineamiento, rango, fecha_inicio, fecha_final, statu) 
        VALUES (?, ?, ?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

}

?>