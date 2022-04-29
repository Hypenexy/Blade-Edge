<?php
require("../../../app/server/mysql/dev.php");
require("../../../app/server/db.php");
$conn = new mysqli($host, "root", "");

$databaseName = 'bladeedge';

$sql = "CREATE DATABASE `$databaseName`";
$reason = "Created DB $databaseName";
querySQL($sql, $conn, $reason);
$sql = "CREATE TABLE `$databaseName`.`profiles` ( `id` BIGINT NOT NULL AUTO_INCREMENT , `username` VARCHAR(30) NOT NULL , `rank` INT(2) NOT NULL , `email` VARCHAR(40) NOT NULL , `password` VARCHAR(700) NOT NULL , `name` VARCHAR(80) NOT NULL , `about` VARCHAR(300) NOT NULL , `gender` INT NOT NULL , `pfp` INT NOT NULL , `banner` INT NOT NULL , `created` INT NOT NULL , `deleted` INT NOT NULL , `banned` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
$reason = "Create profiles' table";
querySQL($sql, $conn, $reason);
$sql = "CREATE TABLE `$databaseName`.`stats` ( `userid` BIGINT NOT NULL , `coins` BIGINT NOT NULL , `level` INT NOT NULL , `wins` INT NOT NULL , `losses` INT NOT NULL , `kills` BIGINT NOT NULL , `deaths` BIGINT NOT NULL , `totaldmgdealt` BIGINT NOT NULL , `totaldmgtaken` BIGINT NOT NULL ) ENGINE = InnoDB;";
$reason = "Create stats' table";
querySQL($sql, $conn, $reason);
$sql = "CREATE TABLE `$databaseName`.`heroes` ( `userid` BIGINT NOT NULL , `name` VARCHAR(30) NOT NULL , `appearance` INT NOT NULL , `level` INT NOT NULL , `type` INT NOT NULL ) ENGINE = InnoDB;";
$reason = "Create heroes' table";
querySQL($sql, $conn, $reason);
$sql = "CREATE TABLE `$databaseName`.`matches` ( `userid` BIGINT NOT NULL , `victimuserid` BIGINT NOT NULL , `result` INT NOT NULL ) ENGINE = InnoDB;";
$reason = "Create matches' table";
querySQL($sql, $conn, $reason);