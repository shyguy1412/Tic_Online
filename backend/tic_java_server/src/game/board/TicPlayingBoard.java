package game.board;

import game.player.TicMarble;
import game.player.TicPlayer;
import server.TicServer;

public class TicPlayingBoard {

	private TicArea playingArea;
	private TicArea[] homeAreas;
	private TicArea[] startAreas;;

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

	public boolean moveMarbleBy(TicMarble marble, int amount) {
		if (marble.area.contains(TicArea.HOME_AREA)) {
			int finalPos = marble.pos + amount;
			if (amount < 0) {
				if (this.marbleInHomeBetween(finalPos, marble.pos - 1, this.getHomeArea(marble.owner.getId()))) {
					this.getHomeArea(marble.owner.getId()).fields[finalPos].place(marble);
					return true;
				}
				return false;
			} else {
				if (this.marbleInHomeBetween(marble.pos + 1, finalPos, this.getHomeArea(marble.owner.getId()))) {
					this.getHomeArea(marble.owner.getId()).fields[finalPos].place(marble);
					return true;
				}
				return false;
			}
		} else if (marble.area.equals(TicArea.PLAYING__AREA))

		{
			int newPos = (marble.pos + amount) % 60;
			while (newPos < 0) {
				newPos += 60;
			}
//		TicServer.printDebug(marble.pos + ":" + newPos);
			boolean canMove = true;
			if (Math.abs(amount) > 1) canMove = checkForMarblesBetween(marble.pos, amount);
//		TicServer.printDebug(marble.pos + ":" + newPos + ":" + canMove);
			if (canMove) {
				if (this.tryMoveIntoHome(marble, amount)) {
					return true;
				}
				// check if on or passing homefield
				// check if rest of moves can be done in home
				this.playingArea.fields[newPos].place(marble);
			}
			return canMove;
		}
		return false;
	}

	public boolean tryMoveIntoHome(TicMarble marble, int offset) {
		if (!marble.hasMoved) // can only enter home if has moved before
			return false;
		int entryPoint = marble.owner.entryPoint;
		if (marble.pos == entryPoint) {
			int steps = Math.abs(offset) - 1;
			TicServer.printDebug(steps);
			if (this.marbleInHomeBetween(0, steps, this.getHomeArea(marble.owner.getId()))){
				this.getHomeArea(marble.owner.getId()).fields[steps].place(marble);
				for(TicField f : this.getArea(marble.area).fields) {
					TicServer.printDebug(f.hasOccupant());
				}
				return true;
			}
		} else {

		}
		boolean backwards = false;
		boolean entryPointFound = false;
		int start = marble.pos;
		if (offset < 0) { // from end to start instead start to end
			start += offset;
			offset *= -1;
			backwards = true;
		}
		int steps = 0; // amount of steps taken before entrypoint is found
		for (int i = start + 1; (i < start + offset) && !entryPointFound; i++, steps++) {
			int index = i % 60;
			while (index < 0) {
				index += 60;
			}
			if (index == entryPoint) {
				entryPointFound = true;
				TicServer.printDebug("ENTRY POINT FOUND");
			}
		}
		if (!entryPointFound) return false;
		//////////
		// Adjust steps to real value
		if (backwards) steps = offset - steps;
		// calculate how many steps are left to be taken
		if(marble.pos != entryPoint) {
			steps++;
		}
		int remainingSteps = Math.abs(offset - steps);

		TicServer.printDebug("HOME ENTRY DATA: " + steps + ":" + offset + ":" + remainingSteps);

		if (this.marbleInHomeBetween(0, remainingSteps, this.getHomeArea(marble.owner.getId()))) {
			this.getHomeArea(marble.owner.getId()).fields[remainingSteps].place(marble);
			return true;
		}
		return false;
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
}
