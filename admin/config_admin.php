<?php
session_start();

require_once '../config.php';

if (!$auth->isLoggedIn() || !$auth->isAdmin()) {
    header('Location: ../index.html');
    exit;
}
?>