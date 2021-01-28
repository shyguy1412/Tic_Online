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
class Field{
  static radius = 20;

  static clickEvent = new Event('click');
  static hoverEvent = new Event('hover');
  static eventTarget = new EventTarget();

  constructor(x, y, id) {
    this.id = id;
    this.occupant = null;
    this.selected = false;
    this.hovered = false;
    this.pos = {
      x: x,
      y: y
    };
  }

  static setDrawOptions(){
    stroke(0);
    strokeWeight(1);
    fill(150, 150, 150, 60);
  }

  static clear(fields){
    fields.forEach((field) => {
      field.occupant = null;
    });

  }

  static getSelectedMarble(fields){
    let x = mouseX;
    let y = mouseY;
    // console.log(fields);
    for(let i = 0; i < fields.length; i++){
      if(fields[i].occupant != null){
        if(fields[i].occupant.selected){
          return fields[i].occupant;
        }
      }
    }
    return null;
  }

  static removeEventListeners(){
    Field.eventTarget = new EventTarget();
  }

  static checkCollision(fields, event){
    let x = mouseX;
    let y = mouseY;
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

  static render(fields){
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
}

class Area{
  constructor(id){
    this.id = id;
    this.fields = [];
  }

  place(marble){
    this.fields.forEach((f) => {
      if(f.id == marble.pos.id){
        f.occupant = marble;
        // console.log("MARBLE PLACED AT: " + this.id + ":"+ marble.pos.id)
        // console.log(f);
      }
    });
  }
}
