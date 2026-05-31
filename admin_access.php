<?php
session_start();

ob_start();

if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
    ob_end_clean();
    header('Location: admin/index.php');
    exit;
} else {
    ob_end_clean();
    header('Location: index.html');
    exit;
}
?>