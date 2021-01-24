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


function createhomeAreas(arr) {
  let positions = [
    {x:width*0.75,y:height*0.5},
    {x:width*0.5, y:height*0.75},
    {x:width*0.25,y:height*0.5},
    {x:width*0.5, y:height*0.25},
  ]
  for(let i = 0; i < 4; i++){
    let home = new Area("homeArea_" + i);
    let x = positions[i].x;
    let y = positions[i].y;
    createFieldsArc(x, y, 50, 4, home.fields, 240, 90*(i+1));
    arr.push(home);
  }
}

function createstartAreas(arr){
  let positions = [
    {x:width*0.875,y:height*0.125},
    {x:width*0.875, y:height*0.875},
    {x:width*0.125,y:height*0.875},
    {x:width*0.125, y:height*0.125},
  ]
  for(let i = 0; i < 4; i++){
    let start = new Area("startArea_" + i);
    let x = positions[i].x;
    let y = positions[i].y;
    createFieldsArc(x, y, 35, 4, start.fields, 360);
    arr.push(start);
  }
}

function getSelectedMarble(){
  let marble = null;
  marble = Field.getSelectedMarble(playingArea.fields);
  if(marble != null)return marble;

  homeAreas.forEach((h) => {
    var m = Field.getSelectedMarble(h.fields);
    if(m!=null)marble=m;
  });
  if(marble != null)return marble;

  startAreas.forEach((h) => {
    var m = Field.getSelectedMarble(h.fields);
    if(m!=null)marble=m;
  });
  if(marble != null)return marble;

}

function updateBoard(data){
  resetFields();
  for(marble of data){
    switch (marble.pos.area.split("_")[0]) {
      case "playingArea":
      playingArea.place(marble);
      break;
      case "startArea":
      startAreas.forEach((area) => {
        if(area.id == marble.pos.area){
          area.place(marble);
        }
      });
      break;
      case "homeArea":
      homeAreas.forEach((area) => {
        if(area.id == marble.pos.area){
          area.place(marble);
        }
      });
      break;
    }
  }
  console.log(startAreas[0]);
  loop();
}

function createFieldsArc(x, y, r, amt, arr,  angle=360, angleOff=0){
  for(let i = 0; i < amt; i++){
    let xpos = x + r * cos(radians((i/amt)*angle)+radians(angleOff));
    let ypos = y + r * sin(radians((i/amt)*angle)+radians(angleOff));
    arr.push(new Field(xpos, ypos, i));
  }
}

function resetFields(){
  ///CLEARING///
  Field.clear(playingArea.fields);
  homeAreas.forEach((h) => {
    Field.clear(h.fields)
  });
  startAreas.forEach((h) => {
    Field.clear(h.fields)
  });

}

function calc_canvas_size(){
  return 600;
}

window.addEventListener('resize', updateCanvasSize);
function updateCanvasSize(){
  let c_size = calc_canvas_size();
  resizeCanvas(c_size, c_size);
}
