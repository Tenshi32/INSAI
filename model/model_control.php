<?php 

class ControlModelo {

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
     * Get a single control by id.
     * Accepts either a single id or an array compatible with execute().
     */
    function getControl($id) {
        $get = $this->pdo->prepare("SELECT * FROM controles WHERE id_control = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all control as an array.
     */
    function getFullAllControl() {
        $get_all = $this->pdo->prepare("SELECT co.*, c.ruta_carpeta, c.descripcion 
        FROM controles co
        JOIN comprobantes c ON co.id_comprobante = c.id_comprobante");
        $get_all->execute();

        return $get_all->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a control. Returns the new inserted id on success, or false on failure.
     */
    function createControl($datos) {
        $create = $this->pdo->prepare("INSERT INTO controles (id_control, id_comprobante, puntuacion, observacion, statu) 
        VALUES (?, ?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

    /**
     * Update control. Returns number of affected rows.
     */
    function updateControl($datos) {
        $update = $this->pdo->prepare("UPDATE controles SET puntuacion = ?, observacion = ?
        WHERE id_control = ?");
        $update->execute($datos);
        return $update->rowCount();
    }

}

?>