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

	public boolean addNewMarbleToPlay(TicPlayer player){
		for(TicMarble m : player.marbles) {
			if(m.area.contains(TicArea.START_AREA)) {
				playingArea.fields[player.entryPoint].place(m);
				m.hasMoved = false;
				for(TicField f : getStartArea(player.getId()).fields) {
					if(f.getOccupant() != null) {
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
		if(!marble1.area.contains(TicArea.PLAYING__AREA) || !marble2.area.contains(TicArea.PLAYING__AREA)) {
			return false;
		}
		int pos1 = marble1.pos;
		int pos2 = marble2.pos;
		playingArea.fields[pos1].place(marble2);
		playingArea.fields[pos2].place(marble1);
		return true;
	}
	
	public boolean checkForMarblesBetween(int start, int offset, TicArea area) {
		for(int i = start; i < start + offset; i++) {
			int index = i % area.fields.length;
			if(area.fields[index].getOccupant() != null) {
				return false;
			}
		}
		return true;
	}
	
	public boolean moveMarbleToHome(TicMarble marble, int pos) {
		marble.hasMoved = true;
		if(marble.hasMoved) {
			//remove marble fomr playing field
			this.playingArea.fields[marble.pos].clear();
			this.getHomeArea(marble.owner.getId()).fields[pos].place(marble);
		}
		return true;
	}
	
	public boolean moveMarbleBy(TicMarble marble, int amount, TicArea area) {
		int newPos = marble.pos + amount % 60;
		boolean canMove = true;
		if(amount > 1)canMove = checkForMarblesBetween(marble.pos, amount, area);
		
		return true;
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

