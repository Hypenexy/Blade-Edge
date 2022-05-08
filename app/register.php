<?php
if(isset($_POST["email"])&&isset($_POST["username"])&&isset($_POST["password"])){
    require("../../app/server/account/checks.php");
    require("../../app/server/db.php");
    require("../../app/server/mdcrypt.php");
    require("../../app/server/session.php");

    $conn = new mysqli($host, $user, $pass, 'bladeedge');
    $datatosend = (object) [];
    $datatosend->user = (object) [];

    $valemail = ValidateEmail($_POST["email"], $conn, "bladeedge");
    $valusername = ValidateUsername($_POST["username"], $conn, "bladeedge");
    $valpassword = ValidatePassword($_POST["password"], $conn, "bladeedge");
    if($valemail==201&&$valusername==201&&$valpassword==201){
        
        $email=$conn->real_escape_string($_POST['email']);
        $username=$conn->real_escape_string($_POST['username']);
        $password=encryptMd($conn->real_escape_string($_POST['password']));
        
	    $datenow = strtotime("now");
        $sql = "INSERT INTO `profiles` (`username`, `email`, `password`, `created`) VALUES ('$username', '$email', '$password', '$datenow')";
        $conn->query($sql);


        $useridquery = mysqli_query($conn, "SELECT * FROM `profiles` WHERE username='$username'");
        $row = $useridquery->fetch_assoc();
        $userid = $row["id"];

        $sql = "INSERT INTO `stats` (`userid`) VALUES ('$userid')";
        $conn->query($sql);

        $_SESSION['id'] = $userid;
    
		$datatosend->user->username = $row['username'];
		$datatosend->user->email = $row['email'];
		$datatosend->status = 201;
    }
    else{
        if($valemail!=201){
            $datatosend->status = $valemail;
        }
        else{
            if($valusername!=201){
                $datatosend->status = $valusername;
            }
            else{
                if($valpassword!=201){
                    $datatosend->status = $valpassword;
                }
            }
        }
    }

	echo json_encode($datatosend);

	$conn->close();
}