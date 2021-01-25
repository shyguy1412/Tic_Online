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

if((!isset($_SESSION['user_id']) || !isset($_SESSION['username'])) && isset($_GET['room_code'])){
  header('Location: http://localhost/testenv/Tic_Online/src/index.php/?room_code=' . $_GET['room_code']);
  die();
} else if (!isset($_GET['room_code'])){
  header('Location: http://localhost/testenv/Tic_Online/src/index.php');
  die();
}
?>

<html>
<head>
  <meta charset="utf-8">

  <title>TIC Online</title>
  <meta name="description" content="Tic Online Multiplayer Board Game">
  <meta name="author" content="Nils Ramstöck">


  <!-- JQuery -->
  <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>

  <!-- Bootstrap -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" crossorigin="anonymous"></script>

  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">

  <!-- Custom Fonts -->
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Rajdhani&display=swap" rel="stylesheet">


  <link type="text/css" rel="stylesheet" href="http://localhost/testenv/Tic_Online/src/css/styles.css">
  <link type="text/css" rel="stylesheet" href="http://localhost/testenv/Tic_Online/src/css/cards.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.2.0/p5.min.js"></script>
</head>
<body>
  <main>

    <div class="container-fluid">
      <div class="row">
        <div class="col-xs-12">
          <h1>TIC Online</h1>
        </div>
      </div>

      <div class="row">
        <div id="debug_options">
          <button type="button" onclick="enterMarble()" name="enter">Enter</button>
          <button type="button" onclick="moveMarbleBy(document.getElementById('num_in').value)" name="move">Move</button><input id="num_in" type="number" name="num" value="5">
          <br><br>
          <button type="button" onclick="swapMarbles()" name="swap">Swap</button>
          <button type="button" onclick="" name="enter">Skip</button>
          <button type="button" onclick="" name="enter">Split</button>
          <button type="button" onclick="" name="enter">Undo</button>
          <button type="button" onclick="" name="enter">Mind Control</button>
          <button type="button" onclick="" name="enter">First Aid</button>
          <button type="button" onclick="" name="enter">Dash Attack</button>
          <button type="button" onclick="" name="enter">Hand Around</button>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-3"></div>
        <div class="col-sm-6" id="board_col">
          <div id="board_wrapper">
          </div>
        </div>
        <div class="col-sm-3"></div>
      </div>

      <div class="row" style="margin-top: 4vh">
        <div class="col-sm-1"></div>
        <div class="col-sm-10" id="board_col">
          <div id="interface_wrapper">
            <div class="hand row">
              <div class="col-sm-1"></div>
              <div class="col-sm-2" id="card_1"></div>
              <div class="col-sm-2" id="card_2"></div>
              <div class="col-sm-2" id="card_3"></div>
              <div class="col-sm-2" id="card_4"></div>
              <div class="col-sm-2" id="card_5"></div>
              <div class="col-sm-1"></div>
            </div>
          </div>
        </div>
        <div class="col-sm-1"></div>
      </div>
    </div>
  </div>
</main>
</body>
<script>

var user_id = "<?php echo $_SESSION['user_id']; ?>";
var room_code = "<?php echo $_SESSION['room_code']; ?>";
var client_username =  "<?php echo $_SESSION['username']; ?>";
if(client_username == ""|| user_id == ""){
  var input_div = document.getElementById('input_div');
  input_div.style = "";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "index-ajax.php");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onload = function(){
    var data = JSON.parse(this.responseText);
    console.log(data);
    if(data.success == "false"){
      showError(data.msg, "username_error_field");
      return;
    }
  }
  xhr.send(`username=${username}&action=enter&data=${room_code}`);
}

var get_param_code = new URLSearchParams(location.search).get("room_code");
if(get_param_code == null || get_param_code != room_code){
  window.history.replaceState(null, null, `?room_code=${room_code}`);
}
console.log("CLIENT ID: " + user_id);
console.log("ROOM CODE: " + room_code);
console.log("USERNAME: " + client_username);
</script>
<script type="text/javascript" src="http://localhost/testenv/Tic_Online/src/js/cards.js"></script>
<script type="text/javascript" src="http://localhost/testenv/Tic_Online/src/js/functions.js"></script>
<script type="text/javascript" src="http://localhost/testenv/Tic_Online/src/js/connection.js"></script>
<script type="text/javascript" src="http://localhost/testenv/Tic_Online/src/js/moves.js"></script>
<script type="text/javascript" src="http://localhost/testenv/Tic_Online/src/js/tic_board_classes.js"></script>
<script type="text/javascript" src="http://localhost/testenv/Tic_Online/src/js/tic_board_functions.js"></script>
<script type="text/javascript" src="http://localhost/testenv/Tic_Online/src/js/tic_board.js"></script>
</html>
