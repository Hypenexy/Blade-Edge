<?php
require("../../app/server/db.php");
require("../../app/server/mdcrypt.php");
require("../../app/server/session.php");

$conn = new mysqli($host, $user, $pass, 'bladeedge');

if(isset($_POST["identity"])&&isset($_POST["password"])){
	$identity=$conn->real_escape_string($_POST['identity']);
	$password=encryptMd($conn->real_escape_string($_POST['password']));
	$datenow=strtotime("now");

	$sqlE ="SELECT `email`, `username`, `password` FROM `profiles` WHERE `email`='$identity' and `password`='$password'";
	$resultE = mysqli_query($conn, $sqlE);
	$sqlU ="SELECT `email`, `username`, `password` FROM `profiles` WHERE `username`='$identity' and `password`='$password'";
	$resultU = mysqli_query($conn, $sqlU);

	if(mysqli_num_rows($resultE)){
		$resultE->num_rows;
		$row = $resultE->fetch_assoc();
        $_SESSION['id'] = $row["id"];
        echo 201;
	}
	else{
		if(mysqli_num_rows($resultU)){
			$resultU->num_rows;
			$row = $resultU->fetch_assoc();
            $_SESSION['id'] = $row["id"];
            echo 201;
		}
		else{
            echo 'Wrong info!';
		}
	}

	$conn->close();
}