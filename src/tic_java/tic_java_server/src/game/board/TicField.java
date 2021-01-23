package game.board;

import game.player.TicMarble;

public class TicField {
	
	private String area;
	private int id;
	private TicMarble occupant;

	TicField(int _id, String _area){
		id = _id;
		area = _area;
	}

	public int getId() {
		return id;
	}
	
	public TicMarble getOccupant() {
		return occupant;
	}


	public void clear() {
		occupant = null;
	}
	
	public void place(TicMarble marble) {
		if(occupant != null) {
			occupant.moveToStart();
		}
		occupant = marble;
		occupant.pos = id;
		occupant.area = area;
	}
	
}
