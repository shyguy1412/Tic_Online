package game.card;

public class TicCard {
	
	public String type;
	public int value;
	
	public TicCard(int _value) {
		value = _value;
		type = TicDeck.STD_DECK_TYPES[value-1];
	}

}
