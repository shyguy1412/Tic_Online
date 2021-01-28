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


//MOVE CONDITIONS
/*
NUMBER: have at least 1 marble in play that can move x amount of spaces
BACKWARDS: have at least 1 marble in the playing area that can move x spacces backwards
SPLIT: have at least one marble in play
SKIP: have at least 1 marble on the playing area
UNDO: be able to play the card you steal
ENTER: have at least 1 marble in your homearea
SWAP: have at least 1 marble on the playing area. playing area must have at least 2 marbles
*/

// function checkMoveOptions() {
//
//   var marbles = [];
//   //conditions
//   var marbleInPlay = false;
//   var marbleInPlayingArea = false;
//   var marbleInStartArea = false;
//   var marblesInPlayingArea = 0;
//   //Get own marbles and fill conditions
//   playingArea.fields.forEach((f) => {
//     if(f.occupant != null){
//       marblesInPlayingArea++;
//       if(f.occupant.user_id == user_id){
//         marbles.push(f.occupant);
//         marbleInPlay = true;
//       }
//     }
//   });
//
//   homeAreas.forEach((h) => {
//     h.fields.forEach((f) => {
//       if(f.occupant != null && f.occupant.user_id == user_id){
//         marbles.push(f.occupant);
//         marbleInPlay = marbleInPlay || true; //true will be replaced with marble.done
//       }
//     });
//   });
//
//   startAreas.forEach((h) => {
//     h.fields.forEach((f) => {
//       if(f.occupant != null && f.occupant.user_id == user_id){
//         marbles.push(f.occupant);
//         marbleInStartArea = true
//       }
//     });
//   });
//
//   console.log(marbles);
//   console.log(marbleInPlay);
//   console.log(marbleInPlayingArea);
//   console.log(marbleInStartArea);
//   console.log(marblesInPlayingArea);
//
//   // var type = $(this).prop("class").split(" ")[1].split("_")[1];
//   // var playable = false;
//   // console.log(type);
//   // switch (type) {
//   //   case "enter":
//   //   playable = marbleInStartArea;
//   //   break;
//   //   case "number":
//   //   var value = $("#" + $(this).prop("id") + "_value").html();
//   //   playable = canMoveMarble(value, marbles);
//   //   break;
//   //   case "backwards":
//   //   playable = canMoveMarble(-4);
//   //   break;
//   //   case "skip":
//   //   playable = canMoveMarble(8) || marbleInPlay;
//   //   break;
//   //   case "split":
//   //   playable = marbleInPlay;
//   //   break;
//   //   case "undo":
//   //   //last card playable
//   //   break;
//   //   case "swap":
//   //   playable = marbleInPlayingArea && marblesInPlayingArea > 1;
//   //   break;
//   // }
//   //iterate through all cards and set playability
//   $(".tic_card").each(function(i){
//     if(!playable){
//       $(this).addClass("tic_unplayable");
//     } else {
//       $(this).removeClass("tic_unplayable");
//     }
//   })
// }

function enableCards() {

  //Enter Card
  $(".tic_card.tic_enter").on("click", function(e){
    if($(this).hasClass("tic_unplayable"))return;
    var id = $(this).prop("id").split("_")[0];
    var value = $("#" + id + "_value").html();
    onMarbleClick(this, {type: "number", id:id, value:value});
    onDoubleClick(this, buildMove({move:"enter",id:id}));
    if(!state.busy){
      $(this).addClass("tic_selected");
      state.busy = true;
    }
  });


  //Number card
  $(".tic_card.tic_number").on("click", function(e){
    if($(this).hasClass("tic_unplayable"))return;
    var id = $(this).prop("id").split("_")[0];
    var value = $("#" + id + "_value").html();
    onMarbleClick(this, {type: "number", id:id, value:value});
    if(!state.busy){
      $(this).addClass("tic_selected");
      state.busy = true;
    }
  });

  //Backwards Card
  $(".tic_card.tic_backwards").on("click", function(e){
    if($(this).hasClass("tic_unplayable"))return;
    var id = $(this).prop("id").split("_")[0];
    onMarbleClick(this, {type: "backwards", id:id});
    if(!state.busy){
      $(this).addClass("tic_selected");
      state.busy = true;
    }
  });


  //Swap Card
  $(".tic_card.tic_swap").on("click", function(e){
    if($(this).hasClass("tic_unplayable"))return;
    if($(this).hasClass("tic_disabled") || state.busy)return;
    $(this).addClass("tic_selected");
    //get value
    var id = $(this).prop("id").split("_")[0];
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
        var move = buildMove({move:"swap",id:id})
        move.moveData.marbles= [
          {area: marbles[0].pos.area, pos: marbles[0].pos.id},
          {area: marbles[1].pos.area, pos: marbles[1].pos.id}
        ]
        connection.sendJSON(move);
        Field.eventTarget.removeEventListener("click", eventFunction);
      }
    }
    Field.eventTarget.addEventListener("click", eventFunction);  //disable card
  });

  //Split Card
  $(".tic_card.tic_split").on("click", function(e){
    //If possible, select card to be played
    if($(this).hasClass("tic_unplayable"))return;
    if($(this).hasClass("tic_disabled") || state.busy)return;
    var id = $(this).prop("id").split("_")[0];
    var card = this;
    $(card).addClass("tic_selected");

    state.busy = true; //lock other cards
    var lock = false;

    $(".tic_split_dot." + id + "_tic_split_btn").on("click", function(e){
      //prevent clicking dots before using up already selected ones
      if(lock)return;
      lock = true;

      //calculate the amount of dots that have been selected
      var dot = parseInt(e.currentTarget.id.split("_")[2]);
      var value = 0;

      var repeat = false;
      for(let i = dot; i > 0; i--){
        var dot = $("#" + id +"_btn_" + i);
        if($(dot).hasClass("tic_used")){
          repeat = true;
          break;
        }
        dot.css("background-color", "red");
        dot.addClass("tic_used");
        value++;
      }
      //////////////////////////////////////////////////////////


      var eventFunction = function(e){
        var marble = e.data.marble;
        if(marble.user_id != user_id)return;

        //case: marble is in homearea
        if(marble.pos.area.includes("homeArea") && !marble.dummy){
          //get the two fields the marble can reach;
          var positions = [marble.pos.id + value, marble.pos.id - value]
          var area;
          //get the right homearea
          homeAreas.forEach((a) => {
            if(a.id == marble.pos.area)area = a;
          });
          //place clickable dummy marbles. These are used as buttons to select
          //where the user wants to move to
          positions.forEach((pos) => {
            if(pos >= 0 && pos < 4){
              if(area.id == marble.pos.area){
                if(area.fields[pos].occupant == null){
                  area.fields[pos].occupant = {
                    color: {r:150,g:150,b:150},
                    pos: marble.pos,
                    dummy: true,
                    value: pos - marble.pos.id,
                    user_id: user_id
                  }
                }
              }
            }
          });
          return;
        }
        //if a dummymarble has been clicked, use its value
        if(marble.dummy){
          value = marble.value;
        }
        //build movedata
        var move = buildMove({move:"split", id:id});
        move.moveData.marble = {area: marble.pos.area, pos:marble.pos.id};
        move.moveData.value = value;
        move.moveData.done = false;
        move.moveData.startTurn = !repeat;
        if(!dot == 7){//turn ends after all 7 dots have been used
          move.moveData.endTurn = false;
        }
        connection.sendJSON(move);
        lock = false;//remove lock
        Field.eventTarget.removeEventListener("click", eventFunction);
      }
      Field.eventTarget.addEventListener("click", eventFunction);
    });
  });


  $(".tic_card.tic_skip").on("click", function(e){
    if($(this).hasClass("tic_unplayable"))return;
    var id = $(this).prop("id").split("_")[0];
    var value = $("#" + id + "_value").html();
    onMarbleClick(this, {type: "number", id:id, value:value});
    onDoubleClick(this, buildMove({move:"skip",id:id}));
    if(!state.busy){
      $(this).addClass("tic_selected");
      state.busy = true;
    }
  });


  $(".tic_card.tic_undo").on("click", function(e){
    if($(this).hasClass("tic_unplayable"))return;
    var id = $(sender).prop("id").split("_");
    var move = buildMove({move:move, id:id});
    move.moveData.endTurn = false;
    onDoubleClick(this, move);
  });
}

function buildMove(card){
  return {
    action: "move",
    room_code: room_code,
    user_id: user_id,
    moveData: {
      endTurn: true,
      startTurn: true,
      card: card.move,
      card_id: card.id
    }
  }
}

function disableCards() {
  $(".tic_card").prop("onclick", null).off("click");
}

function onDoubleClick(sender, move){
  if(!$(sender).hasClass("tic_selected")){
    if($(sender).hasClass("tic_disabled") || state.busy)return;
  } else {
    Field.removeEventListeners();
    connection.sendJSON(move);
    return;
  }
}

function onMarbleClick(sender, data) {
  if($(sender).hasClass("tic_disabled") || state.busy)return;
  var card = this;
  var eventFunction = function(e){
    var marble = e.data.marble;
    if(marble.user_id != user_id)return;
    var move;
    switch (data.type) {
      case "number":
      move = buildMove({move:"number", id:data.id});
      move.moveData.marble = {area: marble.pos.area, pos: marble.pos.id};
      move.moveData.value = data.value;
      console.log(move);
      break;
      case "backwards":
      move = buildMove({move:"backwards", id:data.id});
      move.moveData.marble = {area: marble.pos.area, pos: marble.pos.id};
      default:

    }
    Field.eventTarget.removeEventListener("click", eventFunction);
    connection.sendJSON(move);
  }
  Field.eventTarget.addEventListener("click", eventFunction);
}
