package game.player;

import game.TicGame;
import game.board.TicArea;
import game.board.TicField;
import game.board.TicPlayingBoard;
import server.TicClient;

public class TicPlayer {
	
	private int id;
	public int entryPoint;
	public TicMarble[] marbles;
	public TicTeam team;
	public TicClient client;
	public TicGame game;
	
	public TicPlayer(TicClient _client){
		client = _client;
		marbles = new TicMarble[4];
		for(int i = 0; i < marbles.length; i++) {
			marbles[i] = new TicMarble(i, this);
		}
	}

	public void init() {
		//ADD PLAYER TO BOARD
		TicPlayingBoard board = game.getBoard();
		id = board.addPlayer(this);
		entryPoint = getId() * 15;
		//PLACE MARBLES IN START AREA
		TicArea startarea = board.getStartArea(getId());
		int i = 0;
		for(TicField f : startarea.fields) {
			f.place(marbles[i]);
			marbles[i].setColor();
			i++;
		}
	}

	public int getId() {
		return id;
	}

	public TicField getField(TicMarble marble) {
		TicArea area = game.getBoard().getArea(marble.area);
		return area.fields[marble.pos];
	}

}
