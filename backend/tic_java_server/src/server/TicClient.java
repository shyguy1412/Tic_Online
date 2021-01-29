package server;

import org.java_websocket.WebSocket;

import game.player.TicPlayer;

public class TicClient{
	public TicPlayer player;
	public WebSocket socket;
	public String userID;
	public String roomCode;
	public String username;
}
