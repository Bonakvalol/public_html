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
$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';

if ($username == '' || $email == '') {
    header("Location: ../user_profile.php?error=empty");
    exit();
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
$stmt->execute(array($email, $user_id));
if ($stmt->fetch()) {
    header("Location: ../user_profile.php?error=email_exists");
    exit();
}

try {
    $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ?, phone = ? WHERE id = ?");
    $stmt->execute(array($username, $email, $phone, $user_id));
    header("Location: ../user_profile.php?success=profile");
} catch (PDOException $e) {
    header("Location: ../user_profile.php?error=db");
}
exit();
?>