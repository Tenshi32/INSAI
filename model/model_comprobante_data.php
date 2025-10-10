<?php 

class ComprobanteDataModelo {

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
    function getComprobantesData($id) {
        $get = $this->pdo->prepare("SELECT * FROM comprobantes_data WHERE id_comprobante = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all comprobante as an array.
     */

    function getFullAllComprobantesData() {
        $get_all = $this->pdo->prepare("SELECT cd.*, c.ruta_carpeta, c.descripcion, o.nombre AS observado, m.nombre_meta
        FROM comprobantes_data cd
        JOIN comprobantes c ON cd.id_comprobante = c.id_comprobante
        JOIN observados o ON cd.id_observado = o.id_observado
        JOIN metas m ON cd.id_metas = m.id_meta");
        $get_all->execute();

        return $get_all->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a comprobante. Returns the new inserted id on success, or false on failure.
     */
    function createComprobantesData($datos) {
        $create = $this->pdo->prepare("INSERT INTO comprobantes_data (id_comprobante, id_observado, id_metas) 
        VALUES (?, ?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

}

?>