<?php 

class UsuarioModelo {

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
    function getUsuario($id) {
        $get = $this->pdo->prepare("SELECT * FROM usuarios WHERE id_usuario = ?");
        $params = is_array($id) ? $id : [$id];
        $get->execute($params);

        return $get->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all usuarios as an array.
     */
    function getAllUsuarios() {
        $get_all = $this->pdo->prepare("SELECT * FROM usuarios");
        $get_all->execute();

        return $get_all->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a usuario. Returns the new inserted id on success, or false on failure.
     */
    function createUsuario($datos) {
        $create = $this->pdo->prepare("INSERT INTO usuarios (id_usuario, nombre, apellido, fecha_nacimiento, email, telefono, profesion, statu) 
        VALUES (?, ?, ?, ?, ?, ?, ?)");
        $ok = $create->execute($datos);

        return $ok ? $this->pdo->lastInsertId() : false;
    }

    /**
     * Update usuario. Expects [nombre, email, id]. Returns number of affected rows.
     */
    function updateUsuario($datos) {
        $update = $this->pdo->prepare("UPDATE usuarios SET nombre = ?, email = ? WHERE id_usuario = ?");
        $update->execute($datos);
        return $update->rowCount();
    }

    /**
     * Login: returns the user row on success, or false if not found.
     */
    function login($datos) {
        $login = $this->pdo->prepare("SELECT * FROM usuarios WHERE email = ? AND passwrd = ?");
        $login->execute($datos);

        return $login->fetch(PDO::FETCH_ASSOC);
    }

    function logout() {
        session_unset();
        session_destroy();
        header("Location: index.php");
    }

}

?>