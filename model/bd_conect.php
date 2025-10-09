<?php

class Bd_conect {
 
    function __construct() {
        
    }

    function connect() {
        try {
            $pdo = new PDO('mysql:host=localhost;dbname=insai_poa', 'root', '');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
            return $pdo;
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
            return null;   
        }
    }

}

?>