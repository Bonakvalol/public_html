<?php
require_once dirname(__DIR__) . '/../config.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header("Location: ../../login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$old_password = isset($_POST['old_password']) ? $_POST['old_password'] : '';
$new_password = isset($_POST['new_password']) ? $_POST['new_password'] : '';
$confirm_password = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';

if ($old_password == '' || $new_password == '' || $confirm_password == '') {
    header("Location: ../user_profile.php?error=empty");
    exit();
}

if ($new_password != $confirm_password) {
    header("Location: ../user_profile.php?error=password_match");
    exit();
}

if (strlen($new_password) < 6) {
    header("Location: ../user_profile.php?error=password_length");
    exit();
}

$stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
$stmt->execute(array($user_id));
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    header("Location: ../user_profile.php?error=user_not_found");
    exit();
}

if (!password_verify($old_password, $user['password'])) {
    header("Location: ../user_profile.php?error=old_password");
    exit();
}

$new_hash = password_hash($new_password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->execute(array($new_hash, $user_id));
    header("Location: ../user_profile.php?success=password");
} catch (PDOException $e) {
    header("Location: ../user_profile.php?error=db");
}
exit();
?>