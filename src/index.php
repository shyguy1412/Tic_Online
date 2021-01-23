<?php
// Tic Online is an online multiplayer board game.
// Copyright (C) 2021  Nils Ramstöck
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
?>

<html lang="en">
<head>
  <meta charset="utf-8">

  <title>Tic Online</title>
  <meta name="description" content="Tic Online Multiplayer Board Game">
  <meta name="author" content="Nils Ramstöck">

  <link rel="stylesheet" href="css/styles.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.2.0/p5.min.js"></script>
</head>
<body>
  <h1>Tic Online</h1>
  <div class="main_wrapper">
    <div class="user_wrapper">
      <label for="name">Username</label>
      <input id="username_field" type="text" name="name" value=""><br>
      <span id="username_error_field"></span>
    </div>
    <div class="room_wrapper">
      <label for="room_id">Room ID</label>
      <input id="room_code_field" type="text" name="room_id" value=""><br>
      <span id="roomcode_error_field"></span>
      <br><br>
      <button type="button" name="enter_room_btn" onclick="enterRoom()">Enter Room</button>
      <button type="button" name="create_room_btn" onclick="createRoom()">Create Room</button>
    </div>
  </div>
</body>
<script src="js/functions.js"></script>
<script>
function checkRoomcode(){
  var username = document.getElementById('username_field').value
  var nameRegex = /^[a-zA-Z0-9]+$/;
  var nameValid = username.match(nameRegex);

  if(!username.replace(/\s/g, '').length){
    showError("Roomcode cannot be empty!", "roomcode_error_field");
  }else if(nameValid == null){
    showError("Invalid Roomcode", "roomcode_error_field");
    return false;
  } else {
    return true;
  }
}

function checkUsername(){
  var username = document.getElementById('username_field').value
  var nameRegex = /^[a-zA-Z0-9_]+$/;
  var nameValid = username.match(nameRegex);

  if(!username.replace(/\s/g, '').length){
    showError("Username cannot be empty!", "username_error_field");
  }else if(nameValid == null){
    showError("Your name is not valid. Only letter, numbers and '_' are  acceptable.", "username_error_field");
    return false;
  } else {
    return true;
  }
}

function enterRoom(){
  userCheck = checkUsername();
  roomCheck = checkRoomcode();
  if(!(userCheck && roomCheck))return;
  showError("", "username_error_field");
  showError("", "roomcode_error_field");

  var username = document.getElementById('username_field').value
  var room_code = document.getElementById('room_code_field').value
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "index-ajax.php");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onload = function(){
    var data = JSON.parse(this.responseText);
    console.log(data);
    if(data.success == "false"){
      showError(data.msg, "roomcode_error_field");
      return;
    }
    window.location.assign(`tic.php/?room_code=${data.room_code}`)
  }
  xhr.send(`username=${username}&action=enter&data=${room_code}`);
}


function createRoom() {
  if(!checkUsername())return;
  showError("", "username_error_field");
  var username = document.getElementById('username_field').value
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "index-ajax.php");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onload = function(){
    var data = JSON.parse(this.responseText);
    if(data.success == "false"){
      showError(data.msg, "roomcode_error_field");
      return;
    }
    window.location.assign(`tic.php/?room_code=${data.room_code}`)
  }
  xhr.send(`username=${username}&action=create`);
}
</script>
</html>
