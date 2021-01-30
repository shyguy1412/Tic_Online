package game.board;

import game.player.TicMarble;
import game.player.TicPlayer;

public class TicPlayingBoard {

	private TicArea playingArea;
	private TicArea[] homeAreas;
	private TicArea[] startAreas;;

	public TicPlayingBoard() {
		playingArea = new TicArea(TicArea.PLAYING_AREA, 60);
		homeAreas = new TicArea[4];
		startAreas = new TicArea[4];
		for (int i = 0; i < 4; i++) {
			homeAreas[i] = new TicArea(TicArea.HOME_AREA + "_" + i, 4);
			startAreas[i] = new TicArea(TicArea.START_AREA + "_" + i, 4);
		}
	}

//	public int addPlayer(TicPlayer player) {
//		for (int i = 0; i < 4; i++) {
//			if (homeAreas[i] == null && startAreas[i] == null) {
//				homeAreas[i] = new TicArea(TicArea.HOME_AREA + "_" + i, 4);
//				startAreas[i] = new TicArea(TicArea.START_AREA + "_" + i, 4);
//				return i;
//			}
//		}
//		return -1;
//	}

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
		if (!marble1.area.contains(TicArea.PLAYING_AREA) || !marble2.area.contains(TicArea.PLAYING_AREA)) {
			return false;
		}
		int pos1 = marble1.pos;
		int pos2 = marble2.pos;
//		TicServer.printDebug(pos1 + ":" + pos2);
//		playingArea.fields[pos1].clear();
//		playingArea.fields[pos2].clear();
//		TicServer.printDebug(marble1 + ":" + marble2);
		playingArea.fields[pos1].place(marble2);
		playingArea.fields[pos2].place(marble1);
		return true;
	}

	public boolean checkForMarblesBetween(int start, int offset) {
		if (offset < 0) { // from end to start instead start to end
			start += offset;
			offset *= -1;
		}
//		TicServer.printDebug("Check for marbles: " + start + ":" + offset);
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

	public boolean splitMoveBy(TicMarble marble, int amount) {
		boolean result = true;
		int sign = 1;
		if (amount < 0) {
			amount *= -1;
			sign = -1;
		}
		for (int i = 0; i < amount; i++) {
			result = result && this.moveMarbleBy(marble, 1 * sign);
		}
		return result;
	}

	public boolean canMoveAMarble(TicMarble[] marbles, int amount) {
		for (TicMarble m : marbles) {
			if (m.area.contains(TicArea.START_AREA)) continue;
			boolean canMoveIntoHome = this.canMoveIntoHome(m, amount);
			boolean canMove = this.canMoveMarbleBy(m, amount);
			boolean canMoveInHome = this.canMoveMarbleInHome(m, amount);
			if (canMove || canMoveIntoHome || canMoveInHome) return true;
		}
		return false;
	}

	public boolean moveMarbleBy(TicMarble marble, int amount) {
		if (marble.area.contains(TicArea.HOME_AREA) && this.canMoveMarbleInHome(marble, amount)) {
			int finalPos = marble.pos + amount;
			this.getHomeArea(marble.owner.getId()).fields[finalPos].place(marble);
			return true;
		} else if (this.canMoveMarbleBy(marble, amount)) {
			if (this.canMoveIntoHome(marble, amount)) {
				this.moveIntoHome(marble, amount);
				return true;
			}
			int finalPos = (marble.pos + amount) % 60;
			while (finalPos < 0) {
				finalPos += 60;
			}
			this.getPlayingArea().fields[finalPos].place(marble);
			return true;
		}
		return false;
	}

	public boolean moveIntoHome(TicMarble marble, int amount) {
		if (this.canMoveIntoHome(marble, amount)) {
			int index = Math.abs(amount) - this.distanceFromHome(marble, amount > 0) - 1;
			this.getHomeArea(marble.owner.getId()).fields[index].place(marble);
			return true;
		}
		return false;
	}

	public int distanceFromHome(TicMarble marble, boolean forwards) {
		int dist = 0;
		int entryPoint = marble.owner.entryPoint;
		if (forwards) {
			dist = Math.abs((entryPoint + 60) - marble.pos) % 60;
		} else {
			dist = Math.abs(marble.pos - entryPoint) % 60;
		}
		return dist;
	}

	public boolean canMoveMarbleInHome(TicMarble marble, int amount) {
		int finalPos = marble.pos + amount;
		if (amount < 0 && this.marbleInHomeBetween(finalPos, marble.pos - 1, this.getHomeArea(marble.owner.getId()))) {
			return true;
		} else if (this.marbleInHomeBetween(marble.pos + 1, finalPos, this.getHomeArea(marble.owner.getId()))) {
			return true;
		}
		return false;
	}

	public boolean canMoveMarbleBy(TicMarble marble, int amount) {
		if (marble.area != TicArea.PLAYING_AREA) return false;
		int newPos = (marble.pos + amount) % 60;
		while (newPos < 0) {
			newPos += 60;
		}
		boolean canMove = true;
		if (Math.abs(amount) > 1) canMove = checkForMarblesBetween(marble.pos, amount);
		return canMove;
	}

	public boolean canMoveIntoHome(TicMarble marble, int amount) {
		if (!marble.hasMoved) return false;// can only enter home if has moved before
		int distFromHome = this.distanceFromHome(marble, amount > 0);

		if (distFromHome > Math.abs(amount)) {
			return false;
		}

		if (marble.pos == marble.owner.entryPoint) {
			return this.marbleInHomeBetween(0, Math.abs(amount) - 1, this.getHomeArea(marble.owner.getId()));
		} else {
			int remainingSteps = Math.abs(amount) - distFromHome;
			return this.marbleInHomeBetween(0, remainingSteps - 1, this.getHomeArea(marble.owner.getId()));

		}
	}

	public boolean marbleInHomeBetween(int start, int stop, TicArea homeArea) {
		if (start < 0 || stop >= 4 | stop < start) return false;
		for (int i = start; i <= stop; i++) {
			if (homeArea.fields[i].hasOccupant()) {
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

	public boolean checkIfDone(TicMarble m) {
		if(!m.area.contains(TicArea.HOME_AREA))return false;
		TicArea area = this.getHomeArea(m.owner.getId());
		int pos = m.pos;
		for(int i = pos; i < 4; i++) {
			if(!area.fields[i].hasOccupant())return false;
		}
		return true;
	}
}
