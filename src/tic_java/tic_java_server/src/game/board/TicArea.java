package game.board;

public class TicArea {

	static public String PLAYING__AREA = "playingArea";
	static public String START_AREA = "startArea";
	static public String HOME_AREA = "homeArea";
	
	private String id;
	public TicField[] fields;
	
	TicArea(String _id, int amtFields){
		id = _id;
		
		fields = new TicField[amtFields];
		for(int i = 0; i < amtFields; i++) {
			fields[i] = new TicField(i, id);
		}
	}
	
	public String getId() {
		return id;
	}

}
