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

//Field Object
function FieldObject(id, x, y){
  this.id = id;
  this.occupant = null;
  this.selected = false;
  this.hovered = false;
  this.pos = {
    x: x,
    y: y
  };
}

var Field = {
  radius : 20,
  clickEvent : new Event('click'),
  hoverEvent : new Event('hover'),
  eventTarget : new EventTarget()
}

Field.setDrawOptions = function(){
  stroke(0);
  strokeWeight(width*0.0035);
  fill(150, 150, 150, 60);
}

Field.clear = function(fields){
  fields.forEach((field) => {
    field.occupant = null;
  });

}

Field.removeEventListeners = function(){
  Field.eventTarget = new EventTarget();
}

Field.checkCollision = function(fields, event){

  var s = sin(-board_rotation);
  var c = cos(-board_rotation);
  var pivotX = width*0.5;
  var pivotY = height*0.5;
  var x = mouseX;
  var y = mouseY;

  // translate point back to origin:
  x -= pivotX;
  y -= pivotY;

  // rotate point
  var xnew = x * c - y * s;
  var ynew = x * s + y * c;

  x = xnew;
  y = ynew;


  fields.forEach((field) => {
    if(field.occupant != null && dist(x, y, field.pos.x, field.pos.y) < this.radius/2){
      field.hovered = true;
      event.data = {
        marble: field.occupant,
        mouseButton: mouseButton
      }
      Field.eventTarget.dispatchEvent(event);
    }else{
      field.hovered = false;
    }
  });
}

Field.render = function(fields){
  Field.setDrawOptions();
  fields.forEach((field) => {
    push();
    if(field.occupant != null){
      let r = field.occupant.color.r;
      let g = field.occupant.color.g;
      let b = field.occupant.color.b;
      fill(r, g, b);
      if(field.occupant.selected == true){
        stroke(255);
      }
    }
    let zoom = field.hovered?width*0.005:0;
    ellipse(field.pos.x, field.pos.y, Field.radius + zoom, Field.radius + zoom);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(0);
    textSize(12);
    // text(field.id, field.pos.x, field.pos.y);
    pop();
  });
}

function Area(id){
  this.id = id;
  this.fields = [];
  this.owner = "";
}

Area.prototype.place = function (marble){
  this.fields.forEach((f) => {
    if(f.id == marble.pos.id){
      f.occupant = marble;
    }
  });
}
