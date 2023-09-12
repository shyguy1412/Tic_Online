import { TicCardDisplay } from "@/components/Tic/TicCardDisplay";
import { h } from "preact";
import { useContext } from "preact/hooks";
import { GameManagerContext } from "@/components/Tic/TicGame";

type Props = {};

export function TicHand({ }: Props) {


  const [GameState] = useContext(GameManagerContext);

  const selectedCard = GameState?.selectedCard;

  return <div className='tic-hand'>
    {GameState?.hand?.map((card, i) => <TicCardDisplay
      key={i}
      card={card}
      selected={card.id == selectedCard?.id}
    ></TicCardDisplay>)}
  </div>;
}
