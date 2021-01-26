package game;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

import game.board.TicArea;
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

	private ArrayList<JSONObject> history;
	private int turn = 0;

	private boolean started = false;
	
	public TicGame(String _roomCode) {
		roomCode = _roomCode;
		players = new TicPlayer[4];
		teams = new TicTeam[2];
		teams[0] = new TicTeam();
		teams[1] = new TicTeam();
		history = new ArrayList<JSONObject>();
	}

	/**
	 * 
	 * @param client Client that gets added as player
	 * @return False if game is already full
	 */
	public boolean addPlayer(TicClient client) {
		System.out.println("Adding player: " + client.userID + " to: " + roomCode);
		TicPlayer player = new TicPlayer(client);
		for(TicPlayer p : players) {
			if(p != null && p.client.userID.equals(client.userID))return false;
		}
		for (int i = 0; i < players.length; i++) {
			if (players[i] == null) {
				players[i] = player;
				client.player = player;
				client.player.game = this;
//				System.out.println("Player added successfully");
//				printDebug();
				return true;
			}
		}

		return false;
	}

	public boolean reconnectPlayer(TicClient client) {
		for (TicPlayer p : players) {
//			// TESTING//
//			p.client = client;
//			if (true) continue;
//			//////////
//			System.out.println(p.client.userID + ":" + client.userID);
			if (p.client.userID.equals(client.userID)) {
				p.client = client;
//				System.out.println("Player reconnected successfully");
				return true;
			}
		}
//		if (true) return true; // TESTING
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
		this.sendBoardStateToPlayers();
		this.history.add(this.getBoardState());
		this.started = true;
	}

	public void handleMove(JSONObject moveData) {
		String card = moveData.getString("card");
		boolean success = false;
		switch (card) {
		case "number":
			success = this.handleNumberMove(moveData);
			break;
		case "swap":
			success = this.handleSwapMove(moveData);
			break;
		case "enter":
			success = this.handleStarterMove(moveData);
			break;
		case "skip":
			success = this.handleSkipMove(moveData);
			break;
		case "backwards":
			success = this.handleBackwardsMove(moveData);
			break;
		case "split":
			success = this.handleSplitMove(moveData);
			if (!moveData.getBoolean("done")) {
				this.sendBoardStateToPlayers();
				return;
			}
			break;
		case "undo":
			success = this.handleUndoMove(moveData);
			this.sendBoardStateToPlayers();
			return;
		}
		turn++;
		JSONObject state = this.getBoardState();
		state.put("card", card);
		this.history.add(state);
		this.sendBoardStateToPlayers();
		System.out.println("Board state turn + " + turn + ": " + this.getBoardState().toString());
		System.out.println();
	}

	private boolean handleNumberMove(JSONObject moveData) {
		TicMarble marble = this.getMarbleFromJSON(moveData.getJSONObject("marble"));
		int amount = moveData.getInt("value");
//		if(amount == 4)amount = -amount; //always backwards
		return this.board.moveMarbleBy(marble, amount);
	}

	private boolean handleSwapMove(JSONObject moveData) {
		TicMarble marble1 = this.getMarbleFromJSON(moveData.getJSONArray("marbles").getJSONObject(0));
		TicMarble marble2 = this.getMarbleFromJSON(moveData.getJSONArray("marbles").getJSONObject(1));
		return this.board.swapMarbles(marble1, marble2);
	}

	private boolean handleStarterMove(JSONObject moveData) {
		TicPlayer player = this.getPlayerByUserId(moveData.getString("user_id"));
		return this.board.addNewMarbleToPlay(player);
//		TESTING
//		int i = 0;
//		for (TicPlayer p : players) {
//			board.addNewMarbleToPlay(p);
//			board.moveMarbleToHome(board.getPlayingArea().fields[i++ * 15].getOccupant(), 0);
//			board.addNewMarbleToPlay(p);
//		}
	}

	private boolean handleSkipMove(JSONObject moveData) {
		// NEED TURN SYSTEM FIRST
		return false;
	}

	private boolean handleSplitMove(JSONObject moveData) {
		return this.handleNumberMove(moveData);
	}

	private boolean handleBackwardsMove(JSONObject moveData) {
		TicMarble marble = this.getMarbleFromJSON(moveData.getJSONObject("marble"));
		return this.board.moveMarbleBy(marble, -4);
	}

	private TicMarble getMarbleFromJSON(JSONObject jsonMarble) {
		int pos = jsonMarble.getInt("pos");
		String strArea = jsonMarble.getString("area");
		TicArea area = board.getArea(strArea);
		return area.fields[pos].getOccupant();
	}

	private boolean handleUndoMove(JSONObject moveData) {
		this.turn--;
		boolean result = this.loadState(this.history.get(this.turn));
		if (result) this.history.remove(this.turn);
		return result;
	}

	public void sendBoardStateToClient(TicClient client) {
		JSONObject data = this.getBoardState();
		data.put("action", "update_board");
//		System.out.println("Message to Client:" + data.toString());
		client.socket.send(data.toString());
	}

	private void sendBoardStateToPlayers() {
		for (TicPlayer p : players) {
			this.sendBoardStateToClient(p.client);
		}
	}

	public JSONObject getBoardState() {
		JSONObject data = new JSONObject();
		JSONArray marbles = new JSONArray();
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
				marble.put("marble_id", m.getId());
				marbles.put(marble);
			}
		}
		data.put("data", marbles);
		return data;
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

	public boolean loadState(JSONObject state) {
		JSONArray marbles = state.getJSONArray("data");
		System.out.println("Restoring turn " + turn + ": " + state);
		System.out.println();
		for (int i = 0; i < marbles.length(); i++) {
			JSONObject marble = marbles.getJSONObject(i);
			// get player
			TicPlayer player = this.players[marble.getInt("player_id")];
			// get marble
			TicMarble ticMarble = player.marbles[marble.getInt("marble_id")];
			// get area
			TicArea area = this.board.getArea(marble.getJSONObject("pos").getString("area"));
			// get pos
			int pos = marble.getJSONObject("pos").getInt("id");
			area.fields[pos].place(ticMarble);
		}
		return false;
	}

	private boolean isReadyToStart() {
		for (TicPlayer p : players) {
			if (p == null) return false;
		}
		for (TicTeam t : teams) {
			if (!t.isFull()) return false;
		}
		return true;
	}

	public TicPlayer getPlayerByUserId(String userID) {
		for (TicPlayer p : players) {
			if (p.client.userID.equals(userID)) {
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

	public boolean hasStarted() {
		return started;
	}

}
