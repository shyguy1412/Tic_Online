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

class Field {
  static radius = 20;

  constructor(x, y, id) {
    this.id = id;
    this.occupant = null;
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

  static render(fields){
    Field.setDrawOptions();
    fields.forEach((field) => {
      push();
      if(field.occupant != null){
        let r = colorScheme[field.occupant.player_id].r;
        let g = colorScheme[field.occupant.player_id].g;
        let b = colorScheme[field.occupant.player_id].b;
        fill(r, g, b);
      }
      ellipse(field.pos.x, field.pos.y, Field.radius, Field.radius);
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
        console.log("MARBLE PLACED AT: " + this.id + ":"+ marble.pos.id)
        console.log(f);
      }
    });
  }
}
