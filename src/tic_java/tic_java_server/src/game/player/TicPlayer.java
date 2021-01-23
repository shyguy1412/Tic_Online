package game.player;

import game.TicGame;
import game.board.TicArea;
import game.board.TicField;
import game.board.TicPlayingBoard;
import server.TicClient;

public class TicPlayer {
	
	public int id;
	public TicMarble[] marbles;
	public TicTeam team;
	public TicClient client;
	public TicGame game;
	
	public TicPlayer(TicClient _client){
		client = _client;
//		game = client.game;
		marbles = new TicMarble[4];
		for(int i = 0; i < marbles.length; i++) {
			marbles[i] = new TicMarble(i);
		}
	}

	public void init() {
		//ADD PLAYER TO BOARD
		TicPlayingBoard board = game.getBoard();
		id = board.addPlayer(this);
		
		//PLACE MARBLES IN START AREA
		TicArea startarea = board.getStartArea(id);
		int i = 0;
		for(TicField f : startarea.fields) {
			f.place(marbles[i++]);
		}
	}

}
