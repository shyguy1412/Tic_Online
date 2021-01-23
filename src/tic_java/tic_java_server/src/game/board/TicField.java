package game.board;

import game.player.TicMarble;

public class TicField {
	
	private int id;
	public TicMarble occupant;
	
	TicField(int _id){
		id = _id;
	}

	public int getId() {
		return id;
	}

}
