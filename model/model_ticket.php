<?php 

class TicketModelo {

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
    function getTicket($id) {
        $get = $this->pdo->prepare("SELECT * FROM tickets WHERE id_data = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    function getTicketFull($id) {
        $get = $this->pdo->prepare("SELECT t.id_ticket, t.id_data, t.hora, t.fecha, t.accion, t.descripcion, t.statu,
        u.id_usuario, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido
        FROM tickets t
        JOIN usuarios u ON t.id_data = u.id_usuario
        WHERE t.id_ticket = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * Create a usuario. Returns the new inserted id on success, or false on failure.
     */
    function createTicket($datos) {
        $create = $this->pdo->prepare("INSERT INTO tickets (id_data, hora, fecha, accion, descripcion, statu) 
        VALUES (?, ?, ?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

}

?>