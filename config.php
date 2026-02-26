<?php
$host = "sql113.infinityfree.com";
$user = "if0_41241653";
$pass = "SwiftPayTest";
$db = "if0_41241653_swiftpaytest";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>