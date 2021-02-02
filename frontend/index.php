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

$room_code = isset($_GET['room_code']) ? $_GET['room_code'] : "";
?>

<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="utf-8">

  <title>Tic Online</title>
  <meta name="description" content="Tic Online Multiplayer Board Game">
  <meta name="author" content="Nils Ramstöck">

  <meta name="viewport" content="width=device-width, initial-scale=1">

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

  <!-- Site Specific CSS -->
  <link type="text/css" rel="stylesheet" href="/css/styles.css">

  <!-- P5 -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.2.0/p5.min.js"></script>

</head>
<body>

  <div class="container-fluid">

    <div class="row height-third">
      <div class="col-xs-12">
        <h1 id="page_title" style="text-align: center;">Tic Online</h1>
      </div>
    </div>

    <div class="row height-third">
      <div class="col-sm-4"></div>
      <div class="col-sm-4">

        <input class="form-control" type="text" autocapitalize="off" style="margin-bottom: 7vh;" id="nickname_field" placeholder="Enter a Nickname" data-container="body" data-toggle="popover" data-placement="top" data-content />

        <?php	if(empty($room_code)){ echo '
        <div class="btn btn-block btn-default game-btn" id="create_room_btn">Create Room</div>
        
        <div class="row collapse" id="create_form">
          <div class="col-xs-12">
            <div class="row">
              <div class="col-xs-12">
              	<div class="btn btn-info btn-block" id="create_form_submit"  style="margin-bottom: 10px;">Make Thingy Go</div>
              </div>
            </div>
          </div>
        </div>'; } ?>

        <div class="btn btn-block btn-default game-btn" id="join_room">Join Room</div>

        <div class="row collapse" id="room_form">
          <div class="col-xs-12">
            <div class="row">
              <div class="col-sm-9">
                <input class="form-control" type="text" autocapitalize="off" style="margin-bottom: 10px;" id="room_code_field" name="room_id" placeholder="Room Code" data-container="body" data-toggle="popover" data-placement="bottom" data-content />
              </div>
              <div class="col-sm-3">
                <div class="btn btn-block btn-default game-btn" style="text-align: center;" id="join_submit">Enter&nbsp;<i class="far fa-arrow-alt-circle-right"></i></div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="col-sm-4"></div>
    </div>
  </div>


</body>
<script type="text/javascript" src="/js/functions.js"></script>
<script>

var viewportWidth = $(window).width();

if(viewportWidth > 768){
  $('#page_title').css("font-size", "13vh");
} else {
  $('#page_title').css("font-size", "10vh");
}

if("<?php echo $room_code; ?>" != ""){
  $('#room_code_field').val("<?php echo $room_code; ?>");
}

$(function () {
  $('[data-toggle="popover"]').popover();
});

$('#join_room').on("click", function() {
  if("<?php echo $room_code ?>" == ""){
    $('#room_form').collapse("toggle");
  } else {
    enterRoom();
  }
});

$('#join_submit').on("click", function() {
  enterRoom()
});

$('#create_room_btn').on("click", function() {
    $('#create_form').collapse("toggle");
});

$('#create_form_submit').on("click", function() {
    createRoom();
});

function enterRoom(){
  var userCheck = checkUsername();
  var roomCheck = checkRoomcode();
  if(!(userCheck && roomCheck))return;
  clearError("nickname_field");
  clearError("room_code_field");

  var username = $('#nickname_field').val();
  var room_code = $('#room_code_field').val();

  $.post(
    "index-ajax.php",
    {
      action: 'enter',
      data: room_code,
      username: username
    },
    function( data ) {
      data = JSON.parse(data);
      console.log(data);
      if(data.success == "true"){
        window.location.assign('tic.php?room_code='+data.room_code);
      } else {
        showError(data.msg, "room_code_field");
        return;
      }
    }
  );
}


function createRoom() {
  var userCheck = checkUsername();
  if(!userCheck)return;
  clearError("nickname_field");
  clearError("room_code_field");

  var username = $('#nickname_field').val();
  var room_code = $('#room_code_field').val();

  $.post(
    "index-ajax.php",
    {
      action: 'create',
      data: room_code,
      username: username
    },
    function( data ) {
      data = JSON.parse(data);
      console.log(data);
      if(data.success == "true"){
        window.location.assign('tic.php?room_code='+data.room_code);
      } else {
        showError(data.msg, "room_code_field");
        return;
      }
    }
  );
}
</script>
</html>
