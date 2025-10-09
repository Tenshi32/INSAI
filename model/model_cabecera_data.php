<?php 

class CabeceraDataModelo {

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
    function getCabeceraData($id) {
        $get = $this->pdo->prepare("SELECT * FROM cabeceras_data  WHERE id_cabecera = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    function getCabeceraFull($id) {
        $get = $this->pdo->prepare("SELECT cd.id_cabecera, cd.id_lineamiento, l.nombre AS lineamiento, cd.id_departamento, d.nombre AS departamento, 
        cd.id_tipo_poa, tp.nombre AS tipo_poa
        FROM cabeceras_data cd
        JOIN lineamientos l ON cd.id_lineamiento = l.id_lineamiento
        JOIN departamentos d ON cd.id_departamento = d.id_departamento
        JOIN tipos_poa tp ON cd.id_tipo_poa = tp.id_tipo_poa
        WHERE cd.id_cabecera = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all cabecera as an array.
     */
    function getAllCabeceraData() {
        $get_all = $this->pdo->prepare("SELECT * FROM cabeceras_data ");
        $get_all->execute();

        return $get_all->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a cabecera. Returns the new inserted id on success, or false on failure.
     */
    function createCabeceraData($datos) {
        $create = $this->pdo->prepare("INSERT INTO cabeceras_data (id_cabecera, id_lineamiento, id_departamento, id_tipo_poa) 
        VALUES (?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

}

?>