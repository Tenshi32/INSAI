<?php 

class SeguridadModelo {

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
     * Get a single seguridad by id.
     * Accepts either a single id or an array compatible with execute().
     */
    function getSeguridad($id) {
        $get = $this->pdo->prepare("SELECT * FROM seguridad WHERE id_seguridad = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Create a seguridad. Returns the new inserted id on success, or false on failure.
     */
    function createSeguridad($datos) {
        $datos[2] = password_hash($datos[2], PASSWORD_DEFAULT);

        $create = $this->pdo->prepare("INSERT INTO seguridad (id_seguridad, usuario, paswrd, ruta_foto, cont_fail, token, remember) 
        VALUES (?, ?, ?, ?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

    /**
     * Update seguridad.
     */
    function updateSeguridad($datos) {
        $update = $this->pdo->prepare("UPDATE seguridad SET ruta_foto = ?, usuario = ? WHERE id_seguridad = ?");
        $update->execute($datos);
        return $update->rowCount();
    }

    /**
     * Delete seguridad by id. Returns number of affected rows.
     */
    function deleteSeguridad($id) {
        $del = $this->pdo->prepare("DELETE FROM seguridad WHERE id_seguridad = ?");
        $del->execute([$id]);
        return $del->rowCount();
    }


    function rememberMe($datos) {
        $stmt = $this->pdo->prepare("UPDATE seguridad SET token = ?, remember = ? WHERE id_seguridad = ?");
        $stmt->execute($datos);

        return $stmt->rowCount();
    }

    function incrementFailCount($id) {
        $stmt = $this->pdo->prepare("UPDATE seguridad SET cont_fail = cont_fail + 1 WHERE id_seguridad = ?");
        $stmt->execute([$id]);

        return $stmt->rowCount();
    }

    function resetFailCount($id) {
        $stmt = $this->pdo->prepare("UPDATE seguridad SET cont_fail = 0 WHERE id_seguridad = ?");
        $stmt->execute([$id]);

        return $stmt->rowCount();
    }

    /**
     * Change password. Expects [newPassword, id]. Returns number of affected rows.
     */
    function changePassword($datos) {
        $stmt = $this->pdo->prepare("UPDATE seguridad SET passwrd = ? WHERE id_seguridad = ?");
        $stmt->execute($datos);

        return $stmt->rowCount();
    }

}

?>