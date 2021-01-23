package game.board;

import game.player.TicPlayer;

public class TicPlayingBoard {

	TicArea playingArea;
	TicArea[] homeAreas;
	TicArea[] startAreas;

	public TicPlayingBoard() {
		playingArea = new TicArea("playingField", 60);
		homeAreas = new TicArea[4];
		startAreas = new TicArea[4];
	}

	public int addPlayer(TicPlayer player) {
		for (int i = 0; i < 4; i++) {
			if (homeAreas[i] == null && startAreas[i] == null) {
				homeAreas[i] = new TicArea("homeArea_" + i, 4);
				startAreas[i] = new TicArea("startArea_" + i, 4);
				return i;
			}
		}
		return -1;
	}

	public TicArea getStartArea(int id) {
		for (TicArea a : startAreas) {
			if (a.getId().contains(Integer.toString(id))) {
				return a;
			}
		}
		return null;
	}
	
	public TicArea getHomArea(int id) {
		for (TicArea a : homeAreas) {
			if (a.getId().contains(Integer.toString(id))) {
				return a;
			}
		}
		return null;
	}
}
