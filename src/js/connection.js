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
var m1 = {
  color: {r:255, g:0, b:0},
  pos  : {area:"playingArea", id: 30}
};

var m2 = {
  color: {r:0, g:255, b:0},
  pos  : {area:"homeArea_1", id: 2}
};

var m3 = {
  color: {r:0, g:0, b:255},
  pos  : {area:"startArea_3", id: 3}
};

var m4 = {
  color: {r:255, g:255, b:0},
  pos  : {area:"homeArea_2", id: 2}
};

// connection.send(JSON.stringify(m1)); // Send the message 'Ping' to the server
// connection.send(JSON.stringify(m2)); // Send the message 'Ping' to the server
// connection.send(JSON.stringify(m3)); // Send the message 'Ping' to the server
// connection.send(JSON.stringify(m4)); // Send the message 'Ping' to the server

// When the connection is open, send some data to the server

function connectToServer() {
  connection = new WebSocket('ws://localhost:4444');

  connection.sendJSON = function(json){
    var strData = JSON.stringify(json);
    connection.send(strData);
    console.log("CLIENT: " + strData);
  }

  connection.sendChatMessage = function(msg){
    var data = {
      action: "msg_global",
      msg: {
        username: client_username,
        user_id: user_id,
        room_code: room_code,
        text: msg
      }
    }
    connection.sendJSON(data);
  }

  connection.onopen = function () {
    //INIT CONNECTION
    var data = {
      action: "innit",
      user_id: user_id,
      room_code: room_code
    };
    connection.sendJSON(data);
  };

  // Log errors
  connection.onerror = function (error) {
    console.log('WebSocket Error ' + error);
  };

  // Log messages from the server
  connection.onmessage = function (e) {
    console.log('SERVER: ' + e.data);
    let data = JSON.parse(e.data);
    switch (data.pos.area.split("_")[0]) {
      case "playingArea":
      console.log("PLAYING AREA");
      playingArea.place(data);
      break;
      case "startArea":
      console.log("START");
      startAreas.forEach((area) => {
        if(area.id == data.pos.area){
          area.place(data);
        }
      });
      break;
      case "homeArea":
      console.log("HOME");
      homeAreas.forEach((area) => {
        if(area.id == data.pos.area){
          area.place(data);
        }
      });
      break;
    }
  };
}
