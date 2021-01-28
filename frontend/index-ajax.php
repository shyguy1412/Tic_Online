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

require_once("tic/db.php");

if(isset($_POST['username']) && isset($_POST['action'])){

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

    if (!$statement->execute()) {
      echo "Execute failed: (" . $statement->errno . ") " . $statement->error;
    }

    $strQuery = "INSERT INTO users (name, status, room) VALUES (?, 'active', ?)";
    $statement = $mysqli->prepare($strQuery);
    $statement->bind_param('ss', $_POST['username'], $room_code);

    if (!$statement->execute()) {
      echo "Execute failed: (" . $statement->errno . ") " . $statement->error;
    }

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
    /* Prepared statement, stage 1: prepare */
    if (!($statement = $mysqli->prepare("SELECT COUNT(*) AS result FROM rooms WHERE `room_code`=(?)"))) {
      echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
    }

    /* Prepared statement, stage 2: bind and execute */
    if (!$statement->bind_param('s', $room_code)) {
      echo "Binding parameters failed: (" . $statement->errno . ") " . $statement->error;
    }

    if (!$statement->execute()) {
      echo "Execute failed: (" . $statement->errno . ") " . $statement->error;
    }

    $result = $statement->get_result()->fetch_assoc()['result'];
    $statement->close();
    if($result == 0){
      $return_data = array(
        'success' => 'false',
        'msg'     => 'Invalid Roomcode'
      );
      echo json_encode($return_data);
      die();
    }

    $strQuery = "INSERT INTO users (name, status, room) VALUES (?, 'active', ?)";
    $statement = $mysqli->prepare($strQuery);
    $statement->bind_param('ss', $_POST['username'], $room_code);

    if (!$statement->execute()) {
      echo "Execute failed: (" . $statement->errno . ") " . $statement->error;
    }

    $user_id = $statement->insert_id;
    $statement->close();

    $return_data = array(
      'success' => 'true',
      'room_code' => $room_code ,
      'user_id' => $user_id
    );

    $_SESSION['username'] = $_POST['username'];
    $_SESSION['room_code'] = $room_code;
    $_SESSION['user_id'] = $user_id;

    echo json_encode($return_data);
    exit();
    break;
  }
}


?>
