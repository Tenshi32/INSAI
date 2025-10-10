<?php 

class ComunicatorioModelo {

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
     * Get a single comunicatorio by id.
     * Accepts either a single id or an array compatible with execute().
     */
    function getComunicatorio($id) {
        $get = $this->pdo->prepare("SELECT * FROM comunicatorios WHERE id_lineamiento = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all comunicatorio as an array.
     */
    function getFullAllComunicatorio() {
        $get_all = $this->pdo->prepare("SELECT co.*, l.nombre_lineamiento 
        FROM comunicatorios co
        JOIN lineamientos l ON co.id_lineamiento = l.id_lineamiento");
        $get_all->execute();

        return $get_all->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a comunicatorio. Returns the new inserted id on success, or false on failure.
     */
    function createComunicatorio($datos) {
        $create = $this->pdo->prepare("INSERT INTO comunicatorios (id_comunicatorio, id_lineamiento, fecha_carga, descripcion) 
        VALUES (?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

    /**
     * Update comunicatorio. Returns number of affected rows.
     */
    function updateComunicatorio($datos) {
        $update = $this->pdo->prepare("UPDATE comunicatorios SET fecha_carga = ?, descripcion = ?
        WHERE id_comunicatorio = ?");
        $update->execute($datos);
        return $update->rowCount();
    }

}

?>