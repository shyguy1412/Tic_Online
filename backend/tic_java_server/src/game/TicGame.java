package game;

import org.json.JSONArray;
import org.json.JSONObject;

import game.board.TicArea;
import game.board.TicField;
import game.board.TicPlayingBoard;
import game.card.TicCard;
import game.card.TicDeck;
import game.player.TicMarble;
import game.player.TicPlayer;
import game.player.TicTeam;
import server.TicClient;
import server.TicServer;

public class TicGame {

	private String roomCode;
	private TicPlayer[] players;
	private TicTeam[] teams;
	private TicPlayingBoard board;
	private TicDeck deck;

	private boolean started = false;

	private int turnOfPlayer; // id of the player whos turn it is
	private int roundMaster;
	private JSONObject undoState;
	private boolean swapping;

	public TicGame(String _roomCode) {
		roomCode = _roomCode;
		players = new TicPlayer[4];
		teams = new TicTeam[2];
		teams[0] = new TicTeam(0);
		teams[1] = new TicTeam(1);
		undoState = new JSONObject();
	}

	/**
	 * 
	 * @param client Client that gets added as player
	 * @return False if game is already full
	 */
	public boolean addPlayer(TicClient client) {
		TicPlayer player = new TicPlayer(client);
		for (TicPlayer p : players) {
			if (p != null && p.client.userID.equals(client.userID)) return false;
		}
		for (int i = 0; i < players.length; i++) {
			if (players[i] == null) {
				players[i] = player;
				client.player = player;
				client.player.game = this;
				return true;
			}
		}

		return false;
	}

	public boolean reconnectPlayer(TicClient client) {
		for (TicPlayer p : players) {
//			// TESTING//
//			p.client = client;
//			client.player = p;
//			if (true) continue;
//			//////////
			if (p.client.userID.equals(client.userID)) {
				p.client = client;
				client.player = p;
				if (this.started) {
					this.sendPlayerInfoToClient(client);
					this.sendCardsToClient(client);
					if (p.getId() == this.turnOfPlayer) {
						this.startTurnOf(client);
					}
					if (this.swapping) p.client.socket.send(new JSONObject().put("action", "start_round").toString());
				}
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

		TicPlayer player = client.player;
		if (player.team != null) {
			player.team.removePlayer(player);
		}

		if (!teams[team_id].addPlayer(client.player)) {
			responseData.put("response", "false");
		} else {
			responseData.put("response", "true");
		}

		client.socket.send(responseData.toString());
//		printDebug();
		if (this.isReadyToStart()) {
			startGame();
			TicServer.printDebug("START");
		}
		for (TicPlayer p : players) {
			if (p != null) this.sendTeamData(p.client);
		}
	}

	public void sendTeamData(TicClient client) {

		JSONObject data = new JSONObject();
		data.put("action", "team_update");
		JSONArray jsonPlayers = new JSONArray();
		for (TicPlayer p : this.players) {
			if (p != null && p.team != null) {
				JSONObject player = new JSONObject();
				player.put("username", p.client.username);
				player.put("team", p.team.getId());
				jsonPlayers.put(player);
			}
		}
		data.put("players", jsonPlayers);
		client.socket.send(data.toString());
	}

	private void startGame() {
		TicServer.printDebug("START GAME: " + roomCode);
		this.board = new TicPlayingBoard();
		this.deck = new TicDeck();
		// INIT PLAYERS AND MARBLES
		for (TicTeam t : teams) {
			int i = 0;
			for (TicPlayer p : t.players) {
				p.init(t.getId() + i);
				i += 2;
			}
		}
		this.sendBoardStateToPlayers();
		this.started = true;
		this.startRound();
		this.turnOfPlayer = (int) (Math.floor(Math.random() * 100)) % 4;
	}

	public void handleMove(JSONObject moveData, TicClient client) {
//		TicServer.printDebug("MOVE: " + moveData.toString());
		String card = moveData.getString("type");
		// Save boardstate before moving
//		TicServer.printDebug(card);
		if (moveData.getBoolean("endTurn")) {
			this.undoState.put("card", Integer.parseInt(moveData.getString("card_value")));
			this.undoState.put("board", this.getBoardState());
//			TicServer.printDebug("SAVE BOARD STATE: ");
//			TicServer.printDebug(undoState.toString());
		}
//		TicServer.printDebug("Do move:");
		boolean result = false;
		switch (card) {
		case "number":
			result = this.handleNumberMove(moveData);
			break;
		case "swap":
			result = this.handleSwapMove(moveData);
			break;
		case "enter":
			result = this.handleEnterMove(moveData);
			break;
		case "skip":
			result = this.handleSkipMove(moveData);
			break;
		case "backwards":
			result = this.handleBackwardsMove(moveData);
			break;
		case "split":
			result = this.handleSplitMove(moveData);
			break;
		case "undo":
			result = this.handleUndoMove(moveData);
			break;
		case "throwaway":
			result = true;
			break;
		}
		if(client.player.isDone()) {
			this.controllTeammate(client);
		} else {
			this.controllSelf(client);
		}
		if (moveData.getBoolean("endTurn")) {
			this.sendBoardStateToClient(client);
			JSONObject responseData = new JSONObject();
			responseData.put("action", "move_response");
			responseData.put("card_id", moveData.getString("card_id"));
			responseData.put("result", result);
			client.socket.send(responseData.toString());
			if (result) {
				client.player.removeCard(Integer.parseInt(moveData.getString("card_value")));
				this.turnOfPlayer++;
				this.turnOfPlayer %= 4;
				this.startTurnOf(this.turnOfPlayer);
			}
			boolean roundOver = true;
			for (TicMarble m : client.player.marbles) {
				m.done = this.board.checkIfDone(m);
			}
			for (TicPlayer p : players) {
				roundOver &= p.cards.isEmpty();
			}
			if (roundOver) this.startRound();
		}
		this.sendBoardStateToPlayers();

	}

	private boolean handleNumberMove(JSONObject moveData) {
		TicMarble marble = this.getMarbleFromJSON(moveData.getJSONObject("marble"));
		int amount = Integer.parseInt(moveData.getString("card_value"));
//		if(amount == 4)amount = -amount; //always backwards
		return this.board.moveMarbleBy(marble, amount);
	}

	private boolean handleSwapMove(JSONObject moveData) {
		TicMarble marble1 = this.getMarbleFromJSON(moveData.getJSONArray("marbles").getJSONObject(0));
		TicMarble marble2 = this.getMarbleFromJSON(moveData.getJSONArray("marbles").getJSONObject(1));
		return this.board.swapMarbles(marble1, marble2);
	}

	private boolean handleEnterMove(JSONObject moveData) {
		TicPlayer player = this.getPlayerByUserId(moveData.getString("user_id"));
		for (int i = 1; i < 4; i++) {
			if (player.getId() == 0) {
				TicArea area = board.getHomeArea(player.getId());
				area.fields[i].place(player.marbles[i]);
			}
		}
		return this.board.addNewMarbleToPlay(player);
////		TESTING
//		for (TicPlayer p : players) {
//			board.addNewMarbleToPlay(p);
//			board.getHomeArea(p.getId()).fields[0].place(p.marbles[1]);
//		}return true;
	}

	private boolean handleSkipMove(JSONObject moveData) {
		this.turnOfPlayer++;
		return true;
	}

	private boolean handleSplitMove(JSONObject moveData) {
		TicMarble marble = this.getMarbleFromJSON(moveData.getJSONObject("marble"));
		return this.board.splitMoveBy(marble, moveData.getInt("value"));
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
		TicClient client = this.getPlayerByUserId(moveData.getString("user_id")).client;
		this.loadState(this.undoState);
		JSONObject undoData = new JSONObject();
		TicCard cardEffect = new TicCard(this.undoState.getInt("card"));
		undoData.put("action", "undo_response");
		undoData.put("value", cardEffect.value);
		undoData.put("type", cardEffect.type);
		undoData.put("card_id", moveData.getString("card_id"));
		client.socket.send(undoData.toString());
		client.player.removeCard(Integer.parseInt(moveData.getString("card_value")));
		client.player.cards.add(cardEffect);
		
		for(TicPlayer p : players) {
			if(p.isDone()) {
				this.controllTeammate(p.client);
			} else {
				this.controllSelf(p.client);
			}
		}
		
		return true;
	}

	private void startTurnOf(int playerId) {

		for (TicPlayer p : players) {
			if (p.getId() == playerId) {
				this.startTurnOf(p.client);
				return;
			}
		}
	}

	public void swapCard(TicPlayer player, JSONObject data) {
		// add card to team partners cards as hidden
		player.ready = true;
		TicPlayer teampartner = null;
		for (TicPlayer p : player.team.players) {
			if (p.getId() != player.getId()) {
				teampartner = p;
				break;
			}
		}
		TicCard card = new TicCard(Integer.parseInt(data.getString("card_value")));
		card.hidden = !teampartner.ready;
		teampartner.cards.add(card);
		player.removeCard(card.value);
		// if team partner is ready, send cards
		if (teampartner.ready) {
			this.sendCardsToClient(teampartner.client);
			for (TicCard c : player.cards) {
				c.hidden = false;
			}
			this.sendCardsToClient(player.client);
			JSONObject response = new JSONObject();
			response.put("action", "swap_card_response");
			response.put("result", true);
			player.client.socket.send(response.toString());
			teampartner.client.socket.send(response.toString());

		}

		for (TicPlayer p : players) {
			if (!p.ready) return;
		}
		this.swapping = false;
		this.startTurnOf(turnOfPlayer);
	}

	private void startRound() {
		deck.fillStack();
		deck.shuffle();
		this.roundMaster = ++this.turnOfPlayer % 4;
		this.turnOfPlayer = roundMaster;
		this.swapping = true;
		this.sendPlayerInfoToPlayers();
		TicServer.printDebug("Turn of player: " + this.turnOfPlayer);
		for (TicPlayer p : players) {
			deck.dealToPlayer(p, 5);
			p.ready = false;
			p.client.socket.send(new JSONObject().put("action", "start_round").toString());
		}
	}

	private void startTurnOf(TicClient client) {
		JSONObject data = new JSONObject();
		data.put("action", "start_turn");
		client.socket.send(data.toString());
	}

	public void sendBoardStateToClient(TicClient client) {
		JSONObject data = this.getBoardState();
		data.put("action", "update_board");
//		TicServer.printDebug("Message to Client:" + data.toString());
		client.socket.send(data.toString());
	}

	private void sendCardsToClient(TicClient client) {
		TicPlayer player = client.player;
		JSONObject data = new JSONObject();
		JSONArray cards = new JSONArray();
		data.put("action", "deal");
		for (int i = 0; i < player.cards.size(); i++) {
			JSONObject jsonCard = new JSONObject();
			TicCard ticCard = player.cards.get(i);
			if (ticCard.hidden) continue;
			jsonCard.put("type", ticCard.type);
			jsonCard.put("value", ticCard.value);
			cards.put(jsonCard);
		}
		data.put("cards", cards);
		player.client.socket.send(data.toString());
	}

	public void sendPlayerInfoToClient(TicClient client) {
		JSONObject data = new JSONObject();
		data.put("action", "player_info");
		JSONArray jsonPlayers = new JSONArray();
		for (TicPlayer p : players) {
			JSONObject player = new JSONObject();
			player.put("id", p.getId());
			player.put("user_id", p.client.userID);
			player.put("username", p.client.username);
			jsonPlayers.put(player);
		}
		data.put("players", jsonPlayers);
		client.socket.send(data.toString());

	}
	
	public void controllTeammate(TicClient client) {
		JSONObject data = new JSONObject();
		data.put("action", "controll_teammate");
		TicTeam team = client.player.team;
		data.put("teammate", team.getTeammate(client.player).getId());
		client.socket.send(data.toString());

	}

	public void controllSelf(TicClient client) {
		JSONObject data = new JSONObject();
		data.put("action", "controll_teammate");
		TicTeam team = client.player.team;
		data.put("teammate", client.player.getId());
		client.socket.send(data.toString());

	}

	private void sendPlayerInfoToPlayers() {
		for (TicPlayer p : players) {
			this.sendPlayerInfoToClient(p.client);
		}
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
				marble.put("user_id", p.client.userID);
				marble.put("player_id", p.getId());
				marble.put("marble_id", m.getId());
				marble.put("done", m.done);
				marble.put("has_moved", m.hasMoved);
				marbles.put(marble);
			}
		}
		data.put("data", marbles);
		return data;
	}

	public void printDebug() {
		TicServer.printDebug("Roomcode: " + roomCode);
		TicServer.printDebug();
		TicServer.printDebug("Players: ");
		TicServer.printDebug(players[0] + ", " + players[1] + ", " + players[2] + ", " + players[3]);
		TicServer.printDebug();
		TicServer.printDebug("Teams: ");
		TicServer.printDebug(teams[0] + ": ");
		TicServer.printDebug(teams[0].players[0] + ", " + teams[0].players[1]);
		TicServer.printDebug();
		TicServer.printDebug(teams[1] + ": ");
		TicServer.printDebug(teams[1].players[0] + ", " + teams[1].players[1]);
		TicServer.printDebug("Ready to start" + isReadyToStart());
	}

	public void loadState(JSONObject state) {
		JSONArray marbles = state.getJSONObject("board").getJSONArray("data");
		TicServer.printDebug("Restoring turn: " + state);
		TicServer.printDebug();
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
			ticMarble.hasMoved = marble.getBoolean("has_moved");
			ticMarble.done = marble.getBoolean("done");
		}
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

	public void checkPlayability(TicPlayer player, JSONArray cards) {
		TicMarble[] marbles = player.marbles;
		boolean marbleInPlay = false;
		boolean marbleInPlayingArea = false;
		boolean marbleInStartArea = false;
		int marblesInPlayingArea = 0;
		for (TicMarble m : marbles) {
			marbleInPlayingArea |= m.area.equals(TicArea.PLAYING_AREA);
			marbleInStartArea |= m.area.contains(TicArea.START_AREA);
			marbleInPlay |= !m.area.contains(TicArea.START_AREA) && !m.done;
		}
		for (TicField f : board.getPlayingArea().fields) {
			marblesInPlayingArea += f.hasOccupant() ? 1 : 0;
		}

		JSONObject cardData = new JSONObject();
		JSONArray responseCards = new JSONArray();
		cardData.put("action", "playability");
		cardData.put("cards", responseCards);

		JSONObject undoCard = null;
		if (this.undoState.has("card")) {
			undoCard = new JSONObject();
			undoCard.put("value", this.undoState.getInt("card"));
			undoCard.put("type", new TicCard(undoCard.getInt("value")).type);
		}
		for (int i = 0; i < cards.length(); i++) {
			boolean playable = false;
			int value = cards.getJSONObject(i).getInt("value");
				String type = cards.getJSONObject(i).getString("type");
			switch (type) {
			case "enter":
				playable = marbleInStartArea || this.board.canMoveAMarble(marbles, value);
				break;
			case "backwards":
			case "number":
				playable = this.board.canMoveAMarble(marbles, value);
				break;
			case "skip":
				playable = marbleInPlayingArea;
				break;
			case "split":
				playable = marbleInPlay;
				break;
			case "undo":
				if (undoCard == null) break;
				undoCard.put("id", cards.getJSONObject(i).getString("id"));
				cards.put(undoCard);
				break;
			case "swap":
				playable = marbleInPlayingArea && marblesInPlayingArea > 1;
				break;
			}
			JSONObject card = new JSONObject();
			card.put("id", cards.getJSONObject(i).getString("id"));
			card.put("playable", playable);
			responseCards.put(card);
		}
		player.client.socket.send(cardData.toString());
	}

}
