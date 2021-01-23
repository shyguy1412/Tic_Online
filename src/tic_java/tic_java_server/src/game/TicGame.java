package game;

import game.board.TicPlayingBoard;
import game.player.TicPlayer;
import game.player.TicTeam;
import server.TicClient;

public class TicGame {

	private String roomCode;
	private TicPlayer[] players;
	private TicTeam[] teams;
	private TicPlayingBoard board = new TicPlayingBoard();

	/**
	 * 
	 */
	public String state = "active";
	
	public TicGame(String _roomCode) {
		roomCode = _roomCode;
		players = new TicPlayer[4];
		teams = new TicTeam[2];
	}

	/**
	 * 
	 * @param client Client that gets added as player
	 * @return returns false if game is already full
	 */
	public boolean addPlayer(TicClient client) {
		TicPlayer player = new TicPlayer(client);
		for (int i = 0; i < players.length; i++) {
			if (players[i] == null) {
				players[i] = player;
				return true;
			}
		}
		return false;
	}

	public String getRoomCode() {
		return roomCode;
	}
}
