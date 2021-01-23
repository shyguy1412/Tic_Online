package game.board;

public class TicPlayingBoard {

	TicArea playingArea;
	TicArea[] homeAreas;
	TicArea[] startAreas;
	
	public TicPlayingBoard(){
		playingArea = new TicArea("playingField", 60);
		homeAreas = new TicArea[4];
		for(int i = 0; i < homeAreas.length; i++) {
			homeAreas[i] = new TicArea("homeArea_" + i, 4);
		}
		startAreas = new TicArea[4];
		for(int i = 0; i < homeAreas.length; i++) {
			startAreas[i] = new TicArea("startArea_" + i, 4);
		}
	}
}
