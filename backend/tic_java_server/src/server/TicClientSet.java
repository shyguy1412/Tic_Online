package server;

import java.util.HashSet;
import java.util.ArrayList;

import org.java_websocket.WebSocket;

@SuppressWarnings("serial")
public class TicClientSet extends HashSet<TicClient>{
	
	/**
	 * Removes client based on the WebSocket connection
	 * @param conn WebSocket connection of the client 
	 */
	public void remove(WebSocket conn) {
		for (TicClient client : this) {
			if(client.socket == conn)this.remove(client);
		}
	}

	/**
	 * Finds a client beloning to a WebSocket connection
	 * @param conn WebSocket connection a client
	 * @return Client that belungs to the WebSocket
	 */
	public TicClient getClientFromConnection(WebSocket conn) {
		for (TicClient client : this) {
			if(client.socket == conn)return client;
		}
		return null;
	}

	/**
	 * Finds all clients in a certain room
	 * @param roomCode Searched Roomcode
	 * @return All clients in that room
	 */
	public TicClient[] getClientsInRoom(String roomCode) {
		ArrayList<TicClient> room = new ArrayList<TicClient>();
		for (TicClient client : this) {
			if(client.roomCode.equals(roomCode))room.add(client);
		}
		TicClient[] roomArr = room.toArray(new TicClient[room.size()]);
		return roomArr;
	}
}
