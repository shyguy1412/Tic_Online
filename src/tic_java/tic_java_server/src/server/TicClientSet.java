package server;

import java.util.HashSet;
import java.util.ArrayList;

import org.java_websocket.WebSocket;

@SuppressWarnings("serial")
public class TicClientSet extends HashSet<TicClient>{
	
	public void remove(WebSocket conn) {
		for (TicClient client : this) {
			if(client.socket == conn)this.remove(client);
		}
	}

	public TicClient getClientFromConnection(WebSocket conn) {
		for (TicClient client : this) {
			if(client.socket == conn)return client;
		}
		return null;
	}

	public TicClient[] getClientsInRoom(String roomCode) {
		ArrayList<TicClient> room = new ArrayList<TicClient>();
		for (TicClient client : this) {
			if(client.roomCode.equals(roomCode))room.add(client);
		}
		TicClient[] roomArr = room.toArray(new TicClient[room.size()]);
		return roomArr;
	}
}
