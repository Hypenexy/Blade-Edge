<?php
require("../../../app/server/account/checks.php");
require("../../../app/server/db.php");
require("../../../app/server/mdcrypt.php");
require("../../../app/server/session.php");

$conn = new mysqli($host, $user, $pass, 'bladeedge');

if(isset($_POST["email"])&&isset($_POST["username"])&&isset($_POST["password"])){
    if(ValidateEmail($_POST["email"], $conn)==201&&ValidateUsername($_POST["username"], $conn)==201&&ValidatePassword($_POST["password"], $conn)==201){
        
        $email=$conn->real_escape_string($_POST['email']);
        $username=$conn->real_escape_string($_POST['username']);
        $password=$conn->encryptMd(real_escape_string($_POST['password']));
        
	    $datenow = strtotime("now");
        $sql = "INSERT INTO `profiles` (`username`, `email`, `password`, `created`) VALUES ('$username', '$email', '$password', '$datenow')";
        $conn->query($sql);

        //i have to get user id!
        $sql = "INSERT INTO `stats` (`userid`) VALUES ('$userid')";
        $conn->query($sql);
        
        echo 201;
    }
}