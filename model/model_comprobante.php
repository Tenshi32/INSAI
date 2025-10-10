<?php 

class ComprobanteModelo {

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
    function getComprobantes($id) {
        $get = $this->pdo->prepare("SELECT * FROM comprobantes WHERE id_comprobante = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all comprobante as an array.
     */
    function getAllComprobantes() {
        $get_all = $this->pdo->prepare("SELECT * FROM comprobantes ");
        $get_all->execute();

        return $get_all->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a comprobante. Returns the new inserted id on success, or false on failure.
     */
    function createComprobantes($datos) {
        $create = $this->pdo->prepare("INSERT INTO comprobantes (id_comprobante, ruta_carpeta, fecha_carga, descripcion, statu) 
        VALUES (?, ?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

    /**
     * Update comprobante. Expects [nombre, email, id]. Returns number of affected rows.
     */
    function updateComprobantes($datos) {
        $update = $this->pdo->prepare("UPDATE comprobantes SET ruta_carpeta = ?, descripcion = ?
        WHERE id_comprobante = ?");
        $update->execute($datos);
        return $update->rowCount();
    }

}

?>