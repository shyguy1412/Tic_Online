package game.board;

import game.player.TicMarble;

public class TicField {

	private String area;
	private int id;
	private TicMarble occupant;

	TicField(int _id, String _area) {
		id = _id;
		area = _area;
	}

	public int getId() {
		return id;
	}

	public TicMarble getOccupant() {
		return occupant;
	}

	public boolean hasOccupant() {
		return this.occupant != null;
	}
	
	public void clear() {
		occupant.moveToStart();
	}

	public void place(TicMarble marble) {
		if (occupant != null) {
			occupant.moveToStart();
		}
		// clear previous marble field
		if (marble.area != null) {
			TicField prev = marble.owner.getField(marble);
			prev.empty();
		}
		occupant = marble;
		occupant.pos = id;
		occupant.area = area;
		occupant.hasMoved = true;
	}

	private void empty() {
		this.occupant = null;
	}

}
