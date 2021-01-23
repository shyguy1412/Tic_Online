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

session_start();
?>

<html>
<head>
  <meta charset="utf-8">

  <title>Tic Online</title>
  <meta name="description" content="Tic Online Multiplayer Board Game">
  <meta name="author" content="Nils Ramstöck">
  <link type="text/css" rel="stylesheet" href="http://localhost/testenv/Tic_Online/src/css/styles.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.2.0/p5.min.js"></script>
  <script type="text/javascript" src="http://localhost/testenv/Tic_Online/src/js/functions.js"></script>
  <script type="text/javascript" src="http://localhost/testenv/Tic_Online/src/js/connection.js"></script>
  <script type="text/javascript" src="http://localhost/testenv/Tic_Online/src/js/tic_board_classes.js"></script>
  <script type="text/javascript" src="http://localhost/testenv/Tic_Online/src/js/tic_board_functions.js"></script>
  <script type="text/javascript" src="http://localhost/testenv/Tic_Online/src/js/tic_board.js"></script>
</head>
<body>
  <h1>Tic Online</h1>
  <main>
    <div  id="board_wrapper">
    </div>
  </main>
</body>
<script>
var user_id = "<?php echo $_SESSION['user_id']; ?>";
var room_code = "<?php echo $_SESSION['room_code']; ?>";
var client_username =  "<?php echo $_SESSION['username']; ?>";

var get_param_code = new URLSearchParams(location.search).get("room_code");
if(get_param_code == null || get_param_code != room_code){
  window.history.replaceState(null, null, `?room_code=${room_code}`);
}

console.log("CLIENT ID: " + user_id);
console.log("ROOM CODE: " + room_code);
console.log("USERNAME: " + client_username);
</script>
</html>
