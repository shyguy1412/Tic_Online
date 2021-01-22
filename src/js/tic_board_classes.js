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

  constructor(x, y, ID) {
    this.ID = ID;
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
      ellipse(field.pos.x, field.pos.y, Field.radius, Field.radius);
    });
  }
}

class Area{
  constructor(id){
    this.ID = id;
    this.fields = [];
  }
}
