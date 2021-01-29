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

function checkPlayability() {
  var data = {
    action: "playability",
    cards: []
  }
  $(".tic_card").each(function(i){
    var id = $(this).prop("id").split("_")[0];
    var value = $("#" + id + "_value").html();
    var type = $(this).prop("class").split(" ")[1].split("_")[1];
    var card = {
      id:id,
      value:value,
      type:type
    }
    data.cards.push(card);
  });
  connection.sendJSON(data);
}


function enableThrowaway(){
  enableHover();
  $(".tic_card").each(function(){
    $(this).addClass("tic_throwable");
  });
  $(".tic_card").on("click", function(e){
    var id = $(this).prop("id").split("_")[0];
    var cardValue = $("#" + id + "_value").html();
    onDoubleClick(this, buildMove({move:"throwaway",id:id, value: cardValue}));
    if(!state.busy){
      console.log("SELECT");
      $(this).addClass("tic_selected");
      state.busy = true;
    }
  });
}

function disableThrowaway(){
  disableCards();
  $(".tic_card").each(function(){
    $(this).removeClass("tic_throwable");
  });
}

function enableSwap(){
  console.log("ENABLE SWAP");
  enableHover();
  $(".tic_card").on("click", function(e){
    var id = $(this).prop("id").split("_")[0];
    var cardValue = $("#" + id + "_value").html();
    onDoubleClick(this, {
      action:"swap_card",
      id:id,
      card_value: cardValue,
      room_code: room_code,
      user_id: user_id
    });
    if(!state.busy){
      $(this).addClass("tic_selected");
      state.busy = true;
    }
  });
}

function disableSwap(){
  console.log("DISABLE SWAP");
  disableCards();
}



function enableCards() {
  enableHover();

  //Enter Card
  $(".tic_card.tic_enter").on("click", function(e){
    if($(this).hasClass("tic_unplayable"))return;
    var id = $(this).prop("id").split("_")[0];
    onMarbleClick(this, {type: "number", id:id});
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
    onMarbleClick(this, {type: "number", id:id});
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
    var cardValue = $("#" + id + "_value").html();
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
        disableCards()
        move.moveData.card_value = cardValue;
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
    var cardValue = $("#" + id + "_value").html();
    var card = this;
    console.log("SELECT");
    $(card).addClass("tic_selected");

    state.busy = true; //lock other cards
    var lock = false;

    $(".tic_split_dot." + id + "_tic_split_btn").on("click", function(e){
      //prevent clicking dots before using up already selected ones
      if(lock)return;
      lock = true;

      //calculate the amount of dots that have been selected
      var dotId = parseInt(e.currentTarget.id.split("_")[2]);
      var value = 0;

      var repeat = false;
      for(let i = dotId; i > 0; i--){
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
        if(dotId != 7){//turn ends after all 7 dots have been used
          move.moveData.endTurn = false;
        }
        disableCards()
        move.moveData.card_value = cardValue;
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
    onMarbleClick(this, {type: "number", id:id});
    onDoubleClick(this, buildMove({move:"skip",id:id}));
    if(!state.busy){
      console.log("SELECT");
      $(this).addClass("tic_selected");
      state.busy = true;
    }
  });


  $(".tic_card.tic_undo").on("click", function(e){
    if($(this).hasClass("tic_unplayable"))return;
    var id = $(sender).prop("id").split("_");
    var cardValue = $("#" + id + "_value").html();
    var move = buildMove({move:move, id:id, value:cardValue});
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
      type: card.move,
      card_value: card.value,
      card_id: card.id
    }
  }
}

function disableCards() {
  console.log("DISABLE CARDS");
  disableHover();
  $(".tic_card").prop("onclick", null).off("click");
  $(".tic_card").removeClass("tic_hovered");
  // $(".tic_card").removeClass("tic_unplayable");
}

function enableHover() {
  $(".tic_card").mouseenter(function(){
    if(!$(this).hasClass("tic_unplayable") || $(this).hasClass("tic_throwable")){
      $(this).addClass("tic_hovered")
    }
  })

  $(".tic_card").mouseleave(function(){
    $(this).removeClass("tic_hovered")
  })
}

function disableHover() {
  $(".tic_card").prop("onmouseenter", null).off("mouseenter");
  $(".tic_card").prop("onmouseleave", null).off("mouseleave");

}

function onDoubleClick(sender, move){
  if(!$(sender).hasClass("tic_selected")){
    if($(sender).hasClass("tic_disabled") || state.busy)return;
  } else {
    Field.removeEventListeners();
    disableCards()
    var id = $(sender).prop("id").split("_")[0];
    var cardValue = $("#" + id + "_value").html();
    if(move.action == "move")move.moveData.card_value = cardValue;
    connection.sendJSON(move);
    return;
  }
}

function onMarbleClick(sender, data) {
  if($(sender).hasClass("tic_disabled") || state.busy)return;
  var id = $(sender).prop("id").split("_")[0];
  var cardValue = $("#" + id + "_value").html();
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
    move.card_value = cardValue;
    Field.eventTarget.removeEventListener("click", eventFunction);
    disableCards()
    connection.sendJSON(move);
  }
  Field.eventTarget.addEventListener("click", eventFunction);
}
