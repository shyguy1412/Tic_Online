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
import org.json.JSONObject;

import game.TicGame;

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

	private static int TCP_PORT = 4444;

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
		System.out.println("New connection from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
	}

	@Override
	public void onMessage(WebSocket conn, String message) {
		JSONObject data = new JSONObject(message);
		TicClient client = conns.getClientFromConnection(conn);

		System.out.println("Message from client: " + data);

		switch (data.getString("action")) {
		case "innit":
			client.userID = data.getString("user_id");
			client.roomCode = data.getString("room_code");
			boolean found = false;
			for (TicGame g : games) {
				if (g.getRoomCode().equals(client.roomCode)) {
					if (!g.addPlayer(client)) {
						//Tell player game is full
					}
					found = true;
					break;
				}
			}
			if (!found) {
				games.add(new TicGame(client.roomCode));
			}

			break;
		case "msg_global":
			TicClient room[] = conns.getClientsInRoom(client.roomCode);
			System.out.println(room.length);
			for (TicClient c : room) {
				c.socket.send(data.getJSONObject("msg").toString());
			}
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
		System.out.println("ERROR from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
	}

	@Override
	public void onClose(WebSocket conn, int code, String reason, boolean remote) {
		conns.remove(conn);
		System.out.println("Closed connection to " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
	}

	@Override
	public void onStart() {
		// TODO Auto-generated method stub

	}
}