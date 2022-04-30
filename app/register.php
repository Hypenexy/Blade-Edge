<?php
if(isset($_POST["email"])&&isset($_POST["username"])&&isset($_POST["password"])){
    require("../../app/server/account/checks.php");
    require("../../app/server/db.php");
    require("../../app/server/mdcrypt.php");
    require("../../app/server/session.php");

    $conn = new mysqli($host, $user, $pass, 'bladeedge');
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
        $userid = mysqli_fetch_array($useridquery)["id"];
        //i have to get user id!
        $sql = "INSERT INTO `stats` (`userid`) VALUES ('$userid')";
        $conn->query($sql);

        $_SESSION['id'] = $userid;
        
        echo 201;
    }
    else{
        if($valemail!=201){
            echo $valemail;
        }
        else{
            if($valusername!=201){
                echo $valusername;
            }
            else{
                if($valpassword!=201){
                    echo $valpassword;
                }
            }
        }
    }
    $conn->close();
}