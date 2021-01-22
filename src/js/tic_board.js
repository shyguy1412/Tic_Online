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
let playingFields;
let homeFields = [];
let startFields = [];

function setup() {
  let c_size = calc_canvas_size();
  createCanvas(c_size, c_size).parent("board_wrapper");
  //PLAYING FIELD//
  playingFields = new Area("playingField");
  createFieldsArc(width*0.5, height*0.5, width*0.5 - 60, 60, playingFields.fields);
  createHomeFields(homeFields);
  createStartFields(startFields);
}

function draw() {
  background(255, 134, 89);
  stroke(0);
  strokeWeight(1);
  line(width*0.5, 0, width*0.5, height);
  line(0, height*0.5, width, height*0.5);

  Field.render(playingFields.fields);
  homeFields.forEach((h) => {
    Field.render(h.fields)
  });
  startFields.forEach((h) => {
    Field.render(h.fields)
  });

}
