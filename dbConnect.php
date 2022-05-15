<?php
//Is used to be able to login to the database
$conn = mysqli_connect("localhost","Username","UserPassword","DatabaseName");
if($conn == FALSE) {
  die("Error connecting to mysql server :". mysqli_connect_error());
} ?>
