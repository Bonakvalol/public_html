<?php
session_start();
header('Content-Type: application/json');

require_once 'config.php';

if ($auth->isLoggedIn()) {
    $user = $auth->getUser();
    echo json_encode(array(
        'loggedIn' => true,
        'user' => array(
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role']
        )
    ));
} else {
    echo json_encode(array(
        'loggedIn' => false
    ));
}
?>