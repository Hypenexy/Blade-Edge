<?php
if(isset($_POST["identity"])&&isset($_POST["password"])){
	require("../../app/server/db.php");
	require("../../app/server/mdcrypt.php");
	require("../../app/server/session.php");

	$conn = new mysqli($host, $user, $pass, 'bladeedge');
    $datatosend = (object) [];
    $datatosend->user = (object) [];

	$identity=$conn->real_escape_string($_POST['identity']);
	$password=encryptMd($conn->real_escape_string($_POST['password']));
	$datenow=strtotime("now");

	$sqlE ="SELECT `id`, `username`, `email` FROM `profiles` WHERE `email`='$identity' and `password`='$password'";
	$resultE = mysqli_query($conn, $sqlE);
	$sqlU ="SELECT  `id`, `username`, `email` FROM `profiles` WHERE `username`='$identity' and `password`='$password'";
	$resultU = mysqli_query($conn, $sqlU);

	if(mysqli_num_rows($resultE)){
		$resultE->num_rows;
		$row = $resultE->fetch_assoc();
        $_SESSION['id'] = $row["id"];
		$datatosend->user->username = $row['username'];
		$datatosend->user->email = $row['email'];
		$datatosend->status = 201;
	}
	else{
		if(mysqli_num_rows($resultU)){
			$resultU->num_rows;
			$row = $resultU->fetch_assoc();
            $_SESSION['id'] = $row["id"];
			$datatosend->user->username = $row['username'];
			$datatosend->user->email = $row['email'];
			$datatosend->status = 201;
		}
		else{
			$datatosend->status = 'Wrong info!';
		}
	}

	echo json_encode($datatosend);

	$conn->close();
}