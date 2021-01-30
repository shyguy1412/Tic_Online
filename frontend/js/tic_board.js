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

let board_rotation; //rotation to display home in the lower right corner

let playingAs;

let state = {
  busy: false
};

function setup() {
  createCanvas(0, 0).parent("board_wrapper");

  //PLAYING FIELD//
  playingArea = new Area("playingField");
  createFieldsArc(0, 0, width*0.5 - 60, 60, playingArea.fields, 360, 90);

  //HOME AREAS
  createHomeAreas(homeAreas);

  //START AREAS
  createStartAreas(startAreas);

  //set canvas size
  updateCanvasSize();

  connection = connectToServer(connection);
}

function draw() {
  background(255, 134, 89);

  push();
  translate(width*0.5, height*0.5);
  rotate(board_rotation);

  stroke(1);
  strokeWeight(width*0.005)
  fill(100, 80);
  ellipse(0, 0, width/4, height/4);

  ///RENDERING///
  Field.render(playingArea.fields);
  homeAreas.forEach((h) => {
    Field.render(h.fields)
  });
  startAreas.forEach((h) => {
    Field.render(h.fields)

    //TEMOPRARY:
    //draw usernames under their home areas
    noStroke();
    fill(0);
    textSize(12);
    textAlign(CENTER, CENTER);
    let x = (h.fields[0].pos.x + h.fields[2].pos.x) / 2;
    let y = (h.fields[0].pos.y + h.fields[2].pos.y) / 2;
    push();
    translate(x, y)
    rotate(-board_rotation)
    translate(0, height * 0.08);
    text(h.owner, 0, 0);
    pop();
  });
  pop();

  // console.log(mouseButton);
  // noLoop();
}

//hover check
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

//click check
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
