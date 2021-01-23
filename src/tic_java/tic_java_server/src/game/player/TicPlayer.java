package game.player;

import server.TicClient;

public class TicPlayer {
	
	public TicMarble[] marbles;
	public TicTeam team;
	private TicClient client;
	
	public TicPlayer(TicClient _client){
		client = _client;
		marbles = new TicMarble[4];
		for(int i = 0; i < marbles.length; i++) {
			marbles[i] = new TicMarble(i);
		}
	}

}
