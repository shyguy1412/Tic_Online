package game;

import org.json.JSONArray;
import org.json.JSONObject;

import game.board.TicPlayingBoard;
import game.player.TicMarble;
import game.player.TicPlayer;
import game.player.TicTeam;
import server.TicClient;

public class TicGame {

	private String roomCode;
	private TicPlayer[] players;
	private TicTeam[] teams;
	private TicPlayingBoard board;

	/**
	 * 
	 */
	public String state = "active";

	public TicGame(String _roomCode) {
		roomCode = _roomCode;
		players = new TicPlayer[4];
		teams = new TicTeam[2];
		teams[0] = new TicTeam();
		teams[1] = new TicTeam();
	}

	/**
	 * 
	 * @param client Client that gets added as player
	 * @return False if game is already full
	 */
	public boolean addPlayer(TicClient client) {
		System.out.println("Adding player: " + client.userID + " to: " + roomCode);
		TicPlayer player = new TicPlayer(client);
		for (int i = 0; i < players.length; i++) {
			if (players[i] == null) {
				players[i] = player;
				client.player = player;
				client.player.game = this;
				System.out.println("Player added successfully");
//				printDebug();
				return true;
			}
		}
		return false;
	}

	/**
	 * assigns player to the selected team
	 * 
	 * @param client  Client that sent the request
	 * @param team_id transmitted data
	 */
	public void selectTeam(TicClient client, int team_id) {
		JSONObject responseData = new JSONObject();
		responseData.put("action", "team_select");
		responseData.put("type", "response");
		if (!teams[team_id].addPlayer(client.player)) {
			responseData.put("response", "false");
		} else {
			responseData.put("response", "true");
		}
		client.socket.send(responseData.toString());
//		printDebug();
		if (isReadyToStart()) {
			startGame();
		}
	}

	private void startGame() {
		System.out.println("START GAME: " + roomCode);
		board = new TicPlayingBoard();

		// INIT PLAYERS AND MARBLES
		for (TicPlayer p : players) {
			p.init();
		}
		sendBoardStateToClients();
	}


	public void handleMove(JSONObject moveData) {
		if(moveData.getString("moveType").equals("normal")) {
			//get marble
			int pos = moveData.getJSONObject("marble").getInt("pos");
			int amount = moveData.getInt("amount");
			TicMarble marble = board.getPlayingArea().fields[pos].getOccupant();
			board.moveMarbleBy(marble, amount, board.getPlayingArea());
		} else if(moveData.getString("moveType").equals("special")) {
			String action = moveData.getString("action");
			switch(action) {
			case "add_marble":
				TicPlayer player = getPlayerByUserId(moveData.getString("user_id"));
//				board.addNewMarbleToPlay(player);
				int i = 0;
				for(TicPlayer p : players) {
					board.addNewMarbleToPlay(p);
					board.moveMarbleToHome(board.getPlayingArea().fields[i++ * 15].getOccupant(), 0);
					board.addNewMarbleToPlay(p);
				}
				break;
			case "swap":
				break;
			}
		}
		this.sendBoardStateToClients();
	}
	
	private void sendBoardStateToClients() {
		JSONObject data = new JSONObject();
		JSONArray marbles = new JSONArray();

		data.put("action", "update_board");

		for (TicPlayer p : players) {
			for (TicMarble m : p.marbles) {
				JSONObject marble = new JSONObject();
				JSONObject color = new JSONObject();
				JSONObject pos = new JSONObject();
				pos.put("area", m.area);
				pos.put("id", m.pos);
				color.put("r", m.color.getRed());
				color.put("g", m.color.getGreen());
				color.put("b", m.color.getBlue());
				marble.put("color", color);
				marble.put("pos", pos);
				marble.put("player_id", p.getId());
				
				marbles.put(marble);
			}
		}
		data.put("data", marbles);
		System.out.print("Message to room '" + roomCode + "': " + data);		
		for (TicPlayer p : players) {
			p.client.socket.send(data.toString());
		}
	}

	public void printDebug() {
		System.out.println("Roomcode: " + roomCode);
		System.out.println();
		System.out.println("Players: ");
		System.out.println(players[0] + ", " + players[1] + ", " + players[2] + ", " + players[3]);
		System.out.println();
		System.out.println("Teams: ");
		System.out.println(teams[0] + ": ");
		System.out.println(teams[0].players[0] + ", " + teams[0].players[1]);
		System.out.println();
		System.out.println(teams[1] + ": ");
		System.out.println(teams[1].players[0] + ", " + teams[1].players[1]);
		System.out.println("Ready to start" + isReadyToStart());
	}

	private boolean isReadyToStart() {
		for (TicPlayer p : players) {
			if (p == null)
				return false;
		}
		for (TicTeam t : teams) {
			if (!t.isFull())
				return false;
		}
		return true;
	}

	public TicPlayer getPlayerByUserId(String userID) {
		for(TicPlayer p : players) {
			if(p.client.userID.equals(userID)){
				return p;
			}
		}
		return null;
	}
	
	public String getRoomCode() {
		return roomCode;
	}

	public TicPlayingBoard getBoard() {
		return board;
	}


}
