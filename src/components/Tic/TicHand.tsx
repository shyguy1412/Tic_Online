import { TicCardDisplay } from "@/components/Tic/TicCardDisplay";
import { HandManager, HandManagerReducer } from "@/components/Tic/lib/HandManager";
import { TicCard } from "@/lib/tic/types/TicCard";
import { createContext } from "preact";
import { h } from "preact";
import { useContext, useReducer } from "preact/hooks";
import { TicPlayerState } from "@/lib/tic/types/TicPlayerState";
import { TicGameStateContext } from "@/pages/room/{roomID}";

type Props = {};

export const HandContext = createContext<HandManager | null>(null);

export function TicHand({ }: Props) {

  const game = useContext(TicGameStateContext);

  const HandManager = useReducer(HandManagerReducer, {
    cardsActive: game?.state?.type == 'choose',
    selectedCard: null
  });

  const [{ selectedCard }] = HandManager;

  return <HandContext.Provider value={HandManager}>
    <div className='tic-hand'>
      {game?.hand?.map((card, i) => <TicCardDisplay
        key={i}
        card={card}
        selected={card.id == selectedCard?.id}
      ></TicCardDisplay>)}
    </div>
  </HandContext.Provider>;
}
