<?php

class Model_select {
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

    function getSelect($table, $id_field, $name_field) {
        $get_all = $this->pdo->prepare("SELECT $id_field, $name_field FROM $table");
        $get_all->execute();

        return $get_all->fetchAll(PDO::FETCH_ASSOC);
    }

    function getSelectWhere($table, $id_field, $name_field, $where_field, $where_value) {
        $get_all = $this->pdo->prepare("SELECT $id_field, $name_field FROM $table WHERE $where_field = ?");
        $get_all->execute([$where_value]);

        return $get_all->fetchAll(PDO::FETCH_ASSOC);
    }

}
?>