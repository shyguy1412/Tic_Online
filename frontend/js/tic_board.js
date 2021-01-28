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

let playingArea;
let homeAreas = [];
let startAreas = [];

let state = {
  busy: false,
  card: null
};

function setup() {
  createCanvas(0, 0).parent("board_wrapper");
  //PLAYING FIELD//
  playingArea = new Area("playingField");
  createFieldsArc(width*0.5, height*0.5, width*0.5 - 60, 60, playingArea.fields);

  //HOME AREAS
  createhomeAreas(homeAreas);

  //START AREAS
  createstartAreas(startAreas);

  updateCanvasSize();
  connection = connectToServer(connection);
  enableCards();
}

function draw() {
  background(255, 134, 89);
  /// HELPER LINES
  // stroke(0);
  // strokeWeight(1);
  // line(width*0.5, 0, width*0.5, height);
  // line(0, height*0.5, width, height*0.5);
  ///////////////////////////////////////

  stroke(1);
  fill(100, 80);
  ellipse(width/2, height/2, width/4, height/4);

  ///RENDERING///
  Field.render(playingArea.fields);
  homeAreas.forEach((h) => {
    Field.render(h.fields)
  });
  startAreas.forEach((h) => {
    Field.render(h.fields)
  });
  // console.log(mouseButton);
  noLoop();
}


function mouseMoved(){
  if(mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0){
    Field.checkCollision(playingArea.fields, Field.hoverEvent);
    homeAreas.forEach((h) => {
      Field.checkCollision(h.fields, Field.hoverEvent)
    });
    startAreas.forEach((h) => {
      Field.checkCollision(h.fields, Field.hoverEvent)
    });
    loop();
  }
}

function mouseReleased(){
  if(mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0){
    Field.checkCollision(playingArea.fields, Field.clickEvent);
    homeAreas.forEach((h) => {
      Field.checkCollision(h.fields, Field.clickEvent)
    });
    startAreas.forEach((h) => {
      Field.checkCollision(h.fields, Field.clickEvent)
    });
    loop();
  }
}
