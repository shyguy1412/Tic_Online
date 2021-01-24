<?php
/* Tic Online is an online multiplayer board game.
Copyright (C) 2021  Nils Ramstöck

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>. */

session_start();

$databaseInfo = array(
  "ip" => "localhost",
  "dbusr" => "root",
  "pass" => "",
  "table" => "tic_online"
);

if(isset($_POST['username']) && isset($_POST['action'])){

  $mysqli = new mysqli($databaseInfo['ip'], $databaseInfo['dbusr'], $databaseInfo['pass'], $databaseInfo['table']);
  if ($mysqli->connect_errno) {
    die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
  }
  $mysqli->set_charset("utf8");

  $_SESSION['username'] = $_POST['username'];

  $action = $_POST['action'];
  switch ($action) {
    case 'create':
    //gerenate a room code
    $alphabet = "abcdefghijklmnopqrstuvwxyz1234567890";
    $room_code = substr(str_shuffle($alphabet), 0, 10);

    //// TODO: make room_code unique and catch double generation
    $strQuery = "INSERT INTO rooms (room_code, status) VALUES (?, 'active')";
    $statement = $mysqli->prepare($strQuery);
    $statement->bind_param('s', $room_code);
    $statement->execute();

    $strQuery = "INSERT INTO users (name, status) VALUES (?, 'active')";
    $statement = $mysqli->prepare($strQuery);
    $statement->bind_param('s', $_POST['username']);
    $statement->execute();

    $user_id = $statement->insert_id;

    $return_data = array(
      'success' => 'true',
      'room_code' => $room_code ,
      'user_id' => $user_id
    );

    $_SESSION['room_code'] = $room_code;
    $_SESSION['user_id'] = $user_id;

    echo json_encode($return_data);

    break;

    case('enter'):

    $room_code = $_POST['data'];
    $strQuery = 'SELECT count(*) AS success FROM rooms WHERE room_code=?';
    $statement = $mysqli->prepare($strQuery);
    $statement->bind_param('s', $room_code);
    $statement->execute();
    $result = $statement->get_result()->fetch_assoc()['success'];
    if($result == 0){
      $return_data = array(
        'success' => 'false',
        'msg'     => 'Invalid Roomcode'
      );
      echo json_encode($return_data);
      die();
    }

    $strQuery = "INSERT INTO users (name, status) VALUES (?, 'active')";
    $statement = $mysqli->prepare($strQuery);
    $statement->bind_param('s', $_POST['username']);
    $statement->execute();

    $user_id = $statement->insert_id;

    $return_data = array(
      'success' => 'true',
      'room_code' => $room_code ,
      'user_id' => $user_id
    );

    $_SESSION['room_code'] = $room_code;
    $_SESSION['user_id'] = $user_id;

    echo json_encode($return_data);
    exit();
    break;
  }
}


?>
