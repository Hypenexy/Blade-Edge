<?php
require("../../app/server/session.php");
require("../../app/server/db.php");

$conn = new mysqli($host, $user, $pass, 'bladeedge');

$datatosend = (object) [];
$datatosend->version = "2.0.0";

//user

if(isset($_SESSION['id'])){
    $userid = $_SESSION['id'];
    $useridquery = mysqli_query($conn, "SELECT * FROM `profiles` WHERE id='$userid'");
    $userinfo = mysqli_fetch_array($useridquery);
    $datatosend->user = (object) [];
    $datatosend->user->username = $userinfo['username'];
    $datatosend->user->email = $userinfo['email'];
}

//news

$profilecount = mysqli_fetch_array(mysqli_query($conn, "SELECT COUNT(*) FROM `profiles`"))[0];
$charactercount = mysqli_fetch_array(mysqli_query($conn, "SELECT COUNT(*) FROM `heroes`"))[0];

$datatosend->news = '
<div class="info">
    <p>'.$profilecount.' Players worldwide</p>
    <p>'.$charactercount.' Characters created</p>
</div>';

if(!isset($_SESSION['id'])){
    $datatosend->news = $datatosend->news . '
        <div class="article welcomemsg">
        <h1>Welcome to Blade Edge</h1>
        <h2>Pinned message</h2>
        <p>A game all about fighting. Create your champions and compete with other players!</p>
        </div>
    ';
}

$datatosend->news = $datatosend->news . '
<div class="article">
<h1>Welcome to our BETA</h1>
<h2>Here are some known issues!</h2>
<p>In order for the user menu to work you\'ll need to reload the page. I don\'t know why this happens.</p>
</div>';

echo json_encode($datatosend);

$conn->close();