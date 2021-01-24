package game.card;

import java.util.HashSet;
import java.util.Set;

public class TicDeck {
	
	static public int[] STD_DECK = {
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
			9, //13 && starter
			7, //Swap
			7, //Undo
			1, //Mindcontrol
			1, //First Aid
			1, //Dash Attack
			1  //Hand Around
	};

	private Set<TicCard> stack;
	
	TicDeck(){
		stack = new HashSet<TicCard>();
	}
		
	public void fillStack() {
		for(int i = 0; i < TicDeck.STD_DECK.length; i++) {
			int amount = TicDeck.STD_DECK[i];
			for(int j = 0; j < amount; j++) {
				stack.add(new TicCard(i + 1));
			}
		}		
	}
	
	public boolean remove(int card) {
		for(TicCard i : stack) {
			if(i.value == card) {
				stack.remove(i);
				return true;
			}
		}
		return false;
	}
}
