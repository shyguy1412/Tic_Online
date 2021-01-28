/**
 * Tic Online is an online multiplayer board game.
 *Copyright (C) 2021  Nils Ramstöck
 *
 *This program is free software: you can redistribute it and/or modify
 *it under the terms of the GNU General Public License as published by
 *the Free Software Foundation, either version 3 of the License, or
 *(at your option) any later version.
 *
 *This program is distributed in the hope that it will be useful,
 *but WITHOUT ANY WARRANTY; without even the implied warranty of
 *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *GNU General Public License for more details.
 *
 *You should have received a copy of the GNU General Public License
 *along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package server;

import java.net.InetSocketAddress;
import java.util.HashSet;
import java.util.Set;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.JSONArray;
import org.json.JSONObject;

import game.TicGame;
import game.board.TicPlayingBoard;

/**
 * 
 * @author Nils Ramstöck
 *
 */
public class TicServer extends WebSocketServer {

	public static void main(String[] args) {
		TicServer server = new TicServer();
		server.start();
	}

	public static final boolean DEBUG = true;
	
	private static int TCP_PORT = 8080;

	private TicClientSet conns;
	private Set<TicGame> games;

	public TicServer() {
		super(new InetSocketAddress(TCP_PORT));
		conns = new TicClientSet();
		games = new HashSet<TicGame>();
	}

	@Override
	public void onOpen(WebSocket conn, ClientHandshake handshake) {
		TicClient client = new TicClient();
		client.socket = conn;
		conns.add(client);
		TicServer.printDebug("New connection from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
	}

	@Override
	public void onMessage(WebSocket conn, String message) {
		JSONObject data = new JSONObject(message);
		TicClient client = conns.getClientFromConnection(conn);

		switch (data.getString("action")) {
		case "init":
			this.initClient(client, data);
			TicServer.printDebug();
			break;
		case "move":
			for (TicGame g : games) {
				if (data.getString("room_code").equals(g.getRoomCode())) {
					JSONObject moveData = data.getJSONObject("moveData");
					moveData.put("user_id", data.getString("user_id"));
					g.handleMove(moveData, client);
				}
			}
			break;
		case "msg_global":
			this.sendGlobalMessage(client, data);
			break;
		case "validate_room_code":
			this.validateRoomCode(client, data);
			break;
		case "team_select":
			client.player.game.selectTeam(client, data.getInt("team_id"));
			break;
		case "playability":
			client.player.game.checkPlayability(client.player, data.getJSONArray("cards"));
			break;
		}
	}

	@Override
	public void onError(WebSocket conn, Exception ex) {
		// ex.printStackTrace();
		if (conn != null) {
			conns.remove(conn);
			// do some thing if required
		}
		TicServer.printDebug("ERROR from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
	}

	@Override
	public void onClose(WebSocket conn, int code, String reason, boolean remote) {
//		TicClient client = conns.getClientFromConnection(conn);
		conns.remove(conn);
		TicServer.printDebug("Closed connection to " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
	}

	@Override
	public void onStart() {
		// TODO Auto-generated method stub

	}

	/**
	 * 
	 * @param client Client to be Initilised
	 * @param data   Initialisation Data
	 */
	private void initClient(TicClient client, JSONObject data) {
		client.userID = data.getString("user_id");
		client.roomCode = data.getString("room_code");
		boolean found = false;
		for (TicGame g : games) {
			if (g.getRoomCode().equals(client.roomCode)) {
				if (g.addPlayer(client)) {
					this.sendTeamSelect(client);
				} else {
					if (g.reconnectPlayer(client)) {
						if(g.hasStarted())g.sendBoardStateToClient(client);
						else this.sendTeamSelect(client);
					} else {
						TicServer.printDebug("GAME IS FULL: " + client.roomCode);
					}
				}
				found = true;
				break;
			}
		}
		if (!found) {
			TicGame game = new TicGame(client.roomCode);
			games.add(game);
			addDummyPlayers(game, client); // FOR TESTING
			if (!game.addPlayer(client)) {
				TicServer.printDebug("ERROR CREATING GAME: " + client.roomCode);
			} else {
//				this.sendTeamSelect(client);
			}
			game.selectTeam(client, 1); // FOR TESTING			
			return; // FOR TESTING
		}

	}

	private void sendTeamSelect(TicClient client) {
		JSONObject responseData = new JSONObject();
		responseData.put("action", "team_select");
		responseData.put("type", "request");
		TicServer.printDebug("Message to client: " + responseData.toString());
		client.socket.send(responseData.toString());		
	}

	private void validateRoomCode(TicClient client, JSONObject data) {
		JSONObject responseData = new JSONObject();
		responseData.put("action", "validate_room_code");
		responseData.put("valid", "false");
		for (TicGame g : games) {
			if (g.getRoomCode().equals(data.getString("room_code"))) {
				responseData.put("valid", "false");
				break;
			}
		}
		client.socket.send(responseData.toString());
	}

	private void addDummyPlayers(TicGame game, TicClient client) {
		for (int i = 0; i < 3; i++) {
			TicClient dummy = new TicClient();
			dummy.roomCode = game.getRoomCode();
			dummy.userID = Integer.toString(i);
			dummy.socket = client.socket;
			game.addPlayer(dummy);
			game.selectTeam(dummy, i % 2);
		}
	}

	/**
	 * 
	 * @param client Client that sends the message
	 * @param data   Message data
	 */
	private void sendGlobalMessage(TicClient client, JSONObject data) {
		TicClient room[] = conns.getClientsInRoom(client.roomCode);
		for (TicClient c : room) {
			c.socket.send(data.getJSONObject("msg").toString());
		}
	}
	
	public static void printDebug(Object obj) {
		if(DEBUG)System.out.println(obj);
	}
	
	
	public static void printDebug() {
		if(DEBUG)System.out.println();
	}
}