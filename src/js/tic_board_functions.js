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
    {x:width*0.5, y:height*0.25},
    {x:width*0.75,y:height*0.5},
    {x:width*0.5, y:height*0.75},
    {x:width*0.25,y:height*0.5},
  ]
  for(let i = 0; i < 4; i++){
    let home = new Area("homeArea_" + i);
    let x = positions[i].x;
    let y = positions[i].y;
    createFieldsArc(x, y, 50, 4, home.fields, 240, 90*i);
    arr.push(home);
  }
}

function createstartAreas(arr){
  let positions = [
    {x:width*0.125, y:height*0.125},
    {x:width*0.875,y:height*0.125},
    {x:width*0.875, y:height*0.875},
    {x:width*0.125,y:height*0.875},
  ]
  for(let i = 0; i < 4; i++){
    let start = new Area("startArea_" + i);
    let x = positions[i].x;
    let y = positions[i].y;
    createFieldsArc(x, y, 35, 4, start.fields, 360);
    arr.push(start);
  }
}


function createFieldsArc(x, y, r, amt, arr,  angle=360, angleOff=0){
  for(let i = 0; i < amt; i++){
    let xpos = x + r * cos(radians((i/amt)*angle)+radians(angleOff));
    let ypos = y + r * sin(radians((i/amt)*angle)+radians(angleOff));
    arr.push(new Field(xpos, ypos, i));
  }
}


function calc_canvas_size(){
  return 600;
}

window.addEventListener('resize', updateCanvasSize);
function updateCanvasSize(){
  let c_size = calc_canvas_size();
  resizeCanvas(c_size, c_size);
}
