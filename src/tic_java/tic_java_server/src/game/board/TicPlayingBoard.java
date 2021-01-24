package game.board;

import game.player.TicMarble;
import game.player.TicPlayer;

public class TicPlayingBoard {

	private TicArea playingArea;
	private TicArea[] homeAreas;
	private TicArea[] startAreas;

	public TicPlayingBoard() {
		playingArea = new TicArea(TicArea.PLAYING__AREA, 60);
		homeAreas = new TicArea[4];
		startAreas = new TicArea[4];
	}

	public int addPlayer(TicPlayer player) {
		for (int i = 0; i < 4; i++) {
			if (homeAreas[i] == null && startAreas[i] == null) {
				homeAreas[i] = new TicArea(TicArea.HOME_AREA + "_" + i, 4);
				startAreas[i] = new TicArea(TicArea.START_AREA + "_" + i, 4);
				return i;
			}
		}
		return -1;
	}

	public boolean addNewMarbleToPlay(TicPlayer player) {
		for (TicMarble m : player.marbles) {
			if (m.area.contains(TicArea.START_AREA)) {
				playingArea.fields[player.entryPoint].place(m);
				m.hasMoved = false;
				for (TicField f : getStartArea(player.getId()).fields) {
					if (f.hasOccupant()) {
						f.clear();
						break;
					}
				}
				return true;
			}
		}
		return false;
	}

	public boolean swapMarbles(TicMarble marble1, TicMarble marble2) {
		if (!marble1.area.contains(TicArea.PLAYING__AREA) || !marble2.area.contains(TicArea.PLAYING__AREA)) {
			return false;
		}
		int pos1 = marble1.pos;
		int pos2 = marble2.pos;
		System.out.println(pos1 + ":" + pos2);
//		playingArea.fields[pos1].clear();
//		playingArea.fields[pos2].clear();
		System.out.println(marble1 + ":" + marble2);
		playingArea.fields[pos1].place(marble2);
		playingArea.fields[pos2].place(marble1);
		return true;
	}

	public boolean checkForMarblesBetween(int start, int offset) {
		if (offset < 0) { // from end to start instead start to end
			start += offset;
			offset *= -1;
		}
		System.out.println("Check for marbles: " + start + ":" + offset);
		for (int i = start + 1; i < start + offset; i++) {
			int index = i % 60;
			while (index < 0) {
				index += 60;
			}
			if (this.playingArea.fields[index].hasOccupant()) {
				return false;
			}
		}
		return true;
	}

	public boolean moveMarbleBy(TicMarble marble, int amount) {
		if (!marble.area.equals(TicArea.PLAYING__AREA))
			return false;
		int newPos = (marble.pos + amount) % 60;
		while (newPos < 0) {
			newPos += 60;
		}
//		System.out.println(marble.pos + ":" + newPos);
		boolean canMove = true;
		if (Math.abs(amount) > 1)
			canMove = checkForMarblesBetween(marble.pos, amount);
//		System.out.println(marble.pos + ":" + newPos + ":" + canMove);
		if (canMove) {
			if (this.canMoveIntoHome(marble, newPos)) {
				this.getHomeArea(marble.owner.getId()).fields[newPos - marble.owner.entryPoint - 1].place(marble);
				return true;

			}
			// check if on or passing homefield
			// check if rest of moves can be done in home
			this.playingArea.fields[newPos].place(marble);
		}
		return canMove;
	}

	public boolean canMoveIntoHome(TicMarble marble, int newPos) {
		if (!marble.hasMoved)
			return false;
		int entrypoint = marble.owner.entryPoint;
		for (int i = marble.pos; i <= newPos; i++) {
			if (i == entrypoint) {
				int diff = newPos - entrypoint;
				if (diff > 4)
					return false;
				for (int j = 0; i < diff; i++) {
					if (this.getHomeArea(marble.owner.getId()).fields[j].hasOccupant()) {
						return false;
					}
				}
				return true;
			}
		}
		return false;
	}

	public boolean canMoveInsideHome(TicMarble marble, int step) {
		if (marble.pos + step > 4)
			return false;
		for (int i = marble.pos; i < marble.pos + step; i++) {
			if (this.getHomeArea(marble.owner.getId()).fields[i].hasOccupant()) {
				return false;
			}
		}
		return true;
	}

	public TicArea getArea(String area) {
		String type = area.split("_")[0];
		switch (type) {
		case "playingArea":
			return this.getPlayingArea();
		case "startArea":
			return this.getStartArea(Integer.parseInt(area.split("_")[1]));
		case "homeArea":
			return this.getHomeArea(Integer.parseInt(area.split("_")[1]));
		}
		return null;
	}

	public TicArea getStartArea(int id) {
		for (TicArea a : startAreas) {
			if (a.getId().contains(Integer.toString(id))) {
				return a;
			}
		}
		return null;
	}

	public TicArea getHomeArea(int id) {
		for (TicArea a : homeAreas) {
			if (a.getId().contains(Integer.toString(id))) {
				return a;
			}
		}
		return null;
	}

	public TicArea getPlayingArea() {
		return playingArea;
	}
}
