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

function enterMarble(){
  var move = {
    action: "move",
    room_code: room_code,
    user_id: user_id,
    moveData: {
      card: "starter"
    }
  }
  connection.sendJSON(move);
}

function splitMove(amt) {
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
      console.log(marbles);
      connection.sendJSON(move);
      Field.eventTarget.removeEventListener("click", eventFunction);
    }
  }
  Field.eventTarget.addEventListener("click", eventFunction);
}

function swapMarbles(){
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
      console.log(marbles);
      connection.sendJSON(move);
      Field.eventTarget.removeEventListener("click", eventFunction);
    }
  }
  Field.eventTarget.addEventListener("click", eventFunction);
}

function moveBackwards(){
  state.busy = true;
  var eventFunction = function(e){
    var move = {
      action: "move",
      room_code: room_code,
      user_id: user_id,
      moveData: {
        card: "backwards",
        marble: {area: e.data.marble.pos.area, pos: e.data.marble.pos.id}
      }
    }
    connection.sendJSON(move);
    state.busy = false;
    Field.eventTarget.removeEventListener("click", eventFunction);
  }
  Field.eventTarget.addEventListener("click", eventFunction);
}


function moveMarbleBy(value){
  state.busy = true;
  var eventFunction = function(e){
    var move = {
      action: "move",
      room_code: room_code,
      user_id: user_id,
      moveData: {
        card: "number",
        value: value,
        marble: {area: e.data.marble.pos.area, pos: e.data.marble.pos.id}
      }
    }
    connection.sendJSON(move);
    state.busy = false;
    Field.eventTarget.removeEventListener("click", eventFunction);
  }
  Field.eventTarget.addEventListener("click", eventFunction);
}
