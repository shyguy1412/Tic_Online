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

var connection;

//TEST DATA//
var numberMove = {
  action: "move",
  room_code: room_code,
  user_id: user_id,
  moveData: {
    card: "number",
    value: 5,
    marble: {area: "playingArea", pos: 45}
  }
}

var stepMove = {
  action: "move",
  room_code: room_code,
  user_id: user_id,
  moveData: {
    card: "split",
    marbles: [
      {amount: "3", marble: {area: "playingArea", pos: 20}},
      {amount: "2", marble: {area: "playingArea", pos: 4}},
      {amount: "2", marble: {area: "homeArea_1", pos: 0}},
      {amount: "-1", marble: {area: "homeArea_1", pos: 0}}
    ]
  }
}

var skipMove = {
  action: "move",
  room_code: room_code,
  user_id: user_id,
  moveData: {
    card: "skip"
  }
}

var addMove = {
  action: "move",
  room_code: room_code,
  user_id: user_id,
  moveData: {
    card: "starter"
  }
}

var swapMove = {
  action: "move",
  room_code: room_code,
  user_id: user_id,
  moveData: {
    card: "swap",
    marbles: [
      {area: "playingArea", pos: 45},
      {area: "playingArea", pos: 0}
    ]
  }
}

function buildMove(card){
  return {
    action: "move",
    room_code: room_code,
    user_id: user_id,
    moveData: {
      card: card
    }
  }
}

//Enter Card
$(".tic_card.tic_enter").on("click", function(e){
  if(!$(this).hasClass("tic_selected")){
    if($(this).hasClass(("tic_disabled") || state.busy))return;
  } else {
    connection.sendJSON(buildMove("enter"));
    $(this).addClass("tic_disabled");
    state.busy = false;
    return;
  }
  $(this).addClass("tic_selected");

  //get value
  var elem = e.currentTarget;
  var id = elem.id.split("_")[0];
  var valueSpan = $("#" + id + "_value");
  var value = valueSpan.html();

  valueSpan.html("Enter");
  valueSpan.css("font-size" , "3.5vh");
  //add eventlistener to marble

  state.busy = true;
  var card = this;
  var eventFunction = function(e){
    if(!$(card).hasClass("tic_disabled")){
      var move;

      move = buildMove("number");
      move.moveData.marble = {area: e.data.marble.pos.area, pos: e.data.marble.pos.id};
      move.moveData.value = value;

      //send move and disable card
      connection.sendJSON(move);
      $(card).addClass("tic_disabled");
      state.busy = false;
    }
    Field.eventTarget.removeEventListener("click", eventFunction);
  }
  Field.eventTarget.addEventListener("click", eventFunction);
});


//Number card
$(".tic_card.tic_number").on("click", function(e){
  if($(this).hasClass("tic_disabled") || state.busy)return;
  $(this).addClass("tic_selected");
  //get value
  var elem = e.currentTarget;
  var id = elem.id.split("_")[0];
  var value = $("#" + id + "_value").html();
  //move by

  state.busy = true;
  var card = this;
  var eventFunction = function(e){
    var move = buildMove("number");
    move.moveData.marble = {area: e.data.marble.pos.area, pos: e.data.marble.pos.id};
    move.moveData.value = value;
    //send move and disable card
    connection.sendJSON(move);
    $(card).addClass("tic_disabled");
    state.busy = false;
    Field.eventTarget.removeEventListener("click", eventFunction);
  }
  Field.eventTarget.addEventListener("click", eventFunction);
});


$(".tic_card.tic_backwards").on("click", function(e){
  if($(this).hasClass("tic_disabled") || state.busy)return;
  $(this).addClass("tic_selected");
  //get value
  var elem = e.currentTarget;
  var id = elem.id.split("_")[0];
  //move by

  state.busy = true;
  var card = this;
  var eventFunction = function(e){
    var move = buildMove("backwards");
    move.moveData.marble = {area: e.data.marble.pos.area, pos: e.data.marble.pos.id};

    //send move and disable card
    connection.sendJSON(move);
    $(card).addClass("tic_disabled");
    state.busy = false;
    Field.eventTarget.removeEventListener("click", eventFunction);
  }
  Field.eventTarget.addEventListener("click", eventFunction);
});


//Swap Card
$(".tic_card.tic_swap").on("click", function(e){
  if($(this).hasClass("tic_disabled") || state.busy)return;
  $(this).addClass("tic_selected");
  //get value
  var elem = e.currentTarget;
  var id = elem.id.split("_")[0];
  //move by

  state.busy = true;
  var card = this;
  var marbles = [];
  var eventFunction = function(e){
    var marble = e.data.marble;
    marble.selected = !marble.selected;
    loop();
    removeItemOnce(marbles, marble);

    if(!marble.selected)return;

    marbles.push(marble);
    if(marbles.length == 2){
      var move = {
        action: "move",
        room_code: room_code,
        user_id: user_id,
        moveData: {
          card: "swap",
          marbles: [
            {area: marbles[0].pos.area, pos: marbles[0].pos.id},
            {area: marbles[1].pos.area, pos: marbles[1].pos.id}
          ]
        }
      }
      connection.sendJSON(move);
      $(card).addClass("tic_disabled");
      state.busy = false;
      Field.eventTarget.removeEventListener("click", eventFunction);
    }
  }
  Field.eventTarget.addEventListener("click", eventFunction);  //disable card
});

//Splitcard Interface
$(".tic_card.tic_split").on("click", function(e){
  if($(this).hasClass("tic_disabled") || state.busy)return;
  //get value
  var elem = e.currentTarget;
  var id = elem.id.split("_")[0];
  var card = this;
  //move by


  $(card).addClass("tic_selected");

  state.busy = true;
  var lock = false;
  $(".tic_split_dot." + id + "_tic_split_btn").on("click", function(e){
    if(lock)return;
    lock = true;
    var num = parseInt(e.currentTarget.id.split("_")[2]);
    var value = 0;

    for(let i = num; i > 0; i--){
      var dot = $("#" + id +"_btn_" + i);
      if($(dot).hasClass("tic_used")){
        break;
      }
      dot.css("background-color", "red");
      dot.addClass("tic_used");
      value++;
    }

    var eventFunction = function(e){
      var move = buildMove("split");
      move.moveData.marble = {area: e.data.marble.pos.area, pos: e.data.marble.pos.id};
      move.moveData.value = value;
      move.moveData.done = false;
      //send move and disable card
      if(num == 7){
        $(card).addClass("tic_disabled");
        state.busy = false;
        move.moveData.done = true;
        console.log(state);
      }
      connection.sendJSON(move);
      lock = false;
      Field.eventTarget.removeEventListener("click", eventFunction);
    }
    Field.eventTarget.addEventListener("click", eventFunction);
  });
});


$(".tic_card.tic_skip").on("click", function(e){
  if(!$(this).hasClass("tic_selected")){
    if($(this).hasClass(("tic_disabled") || state.busy))return;
  } else {
    connection.sendJSON(buildMove("skip"));
    $(this).addClass("tic_disabled");
    state.busy = false;
    return;
  }
  $(this).addClass("tic_selected");

  //get value
  var elem = e.currentTarget;
  var id = elem.id.split("_")[0];
  var valueSpan = $("#" + id + "_value");
  var value = valueSpan.html();

  valueSpan.html("Skip");
  valueSpan.css("font-size" , "3.5vh");
  //add eventlistener to marble

  state.busy = true;
  var card = this;
  var eventFunction = function(e){
    if(!$(card).hasClass("tic_disabled")){
      var move;

      move = buildMove("number");
      move.moveData.marble = {area: e.data.marble.pos.area, pos: e.data.marble.pos.id};
      move.moveData.value = value;

      //send move and disable card
      connection.sendJSON(move);
      $(card).addClass("tic_disabled");
      state.busy = false;
    }
    Field.eventTarget.removeEventListener("click", eventFunction);
  }
  Field.eventTarget.addEventListener("click", eventFunction);
});

$(".tic_card.tic_undo").on("click", function(e){
  if(!$(this).hasClass("tic_selected")){
    if($(this).hasClass(("tic_disabled") || state.busy))return;
  } else {
    connection.sendJSON(buildMove("undo"));
    $(this).addClass("tic_disabled");
    state.busy = false;
    return;
  }
  $(this).addClass("tic_selected");
  state.busy = true;
});
