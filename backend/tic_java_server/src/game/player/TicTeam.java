package game.player;

public class TicTeam {
	public TicPlayer[] players;
	private int id;
	
	public TicTeam(int _id){
		id = _id;
		 players = new TicPlayer[2];
	}

	/**
 * 
 * @param player Player that gets added to the team
 * @return False if team is already full
 */
	public boolean addPlayer(TicPlayer player) {
		for (int i = 0; i < players.length; i++) {
			if (players[i] == null) {
				players[i] = player;
				player.team = this;
				return true;
			}
		}
		return false;
	}

	public boolean removePlayer(TicPlayer player) {
		for (int i = 0; i < players.length; i++) {
			if (players[i] == player) {
				players[i].team = null;
				players[i] = null;
				return true;
			}
		}
		return false;
	}
	public boolean isFull() {
		for(TicPlayer p : players) {
			if(p == null)return false;
		}
		return true;
	}

	public int getId() {
		return id;
	}


}
