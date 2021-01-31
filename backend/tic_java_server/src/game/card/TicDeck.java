package game.card;

import java.util.ArrayList;
import java.util.Collections;
import org.json.JSONArray;
import org.json.JSONObject;

import game.player.TicPlayer;
import server.TicServer;

public class TicDeck {

	static public final int[] STD_DECK_AMOUNTS = {
			9, //1 && starter
			7, //2 
			7, //3
			7, //4 = backwards
			7, //5
			7, //6
			8, //7 = split
			7, //8 && skip
			7, //9
			7, //10
			0, //11
			7, //12
			9, //13 && enter
			7, //Swap
			7, //Undo (7)
			0, //Mindcontrol
			0, //First Aid
			0, //Dash Attack
			0  //Hand Around
	};
	
	static public final String[] STD_DECK_TYPES = {
			"enter", 	 	//1
			"number", 	 	//2
			"number", 	 	//3
			"backwards", 	//4
			"number",	 	//5
			"number",	 	//6
			"split",	 	//7
			"skip",		 	//8
			"number",	 	//9
			"number",	 	//10 
			"number",	 	//11 
			"number",	 	//12
			"enter",	 	//13
			"swap",		 	//14
			"undo",		 	//15
			"mindcontrol",	//16
			"first_aid", 	//17
			"dash_attack",	//18
			"card_cycle"  	//19
	};

	private ArrayList<TicCard> stack;
	
	public TicDeck(){
		stack = new ArrayList<TicCard>();
	}
		
	public void fillStack() {
		for(int i = 0; i < TicDeck.STD_DECK_AMOUNTS.length; i++) {
			int amount = TicDeck.STD_DECK_AMOUNTS[i];
			for(int j = 0; j < amount; j++) {
				stack.add(new TicCard(i + 1));
			}
		}		
	}
	
	public void shuffle() {
		Collections.shuffle(stack);

	}
	
	public void dealToPlayer(TicPlayer player, int amount) {
		JSONObject data = new JSONObject();
		JSONArray cards = new JSONArray();
		data.put("action", "deal");
		if(player.getId() == 0) {
			stack.add(0, new TicCard(1));
			stack.add(0, new TicCard(1));
			stack.add(0, new TicCard(4));
			stack.add(0, new TicCard(5));
			stack.add(0, new TicCard(7));
		}
		for(int i = 0; i < amount; i++) {
			JSONObject jsonCard = new JSONObject();
			TicCard ticCard = stack.get(0);
			jsonCard.put("type", ticCard.type);
			jsonCard.put("value", ticCard.value);
			cards.put(jsonCard);
			player.cards.add(ticCard);
			stack.remove(0);
		}
		data.put("cards", cards);
		player.client.socket.send(data.toString());
	}
}
