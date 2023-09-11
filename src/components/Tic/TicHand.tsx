import { TicCardDisplay } from "@/components/Tic/TicCardDisplay";
import { HandManager, HandManagerReducer } from "@/components/Tic/lib/HandManager";
import { TicCard } from "@/lib/tic/types/TicCard";
import { createContext } from "preact";
import { h } from "preact";
import { useReducer } from "preact/hooks";
import { TicPlayerState } from "@/lib/tic/types/TicPlayerState";

type Props = {
  cards: TicCard[];
  state: TicPlayerState;
};

export const HandContext = createContext<HandManager | null>(null);

export function TicHand({ cards, state }: Props) {

  const HandManager = useReducer(HandManagerReducer, {
    cardsActive: state.type == 'choose',
    selectedCard: null
  });

  const [{ selectedCard }] = HandManager;

  return <HandContext.Provider value={HandManager}>
    <div className='tic-hand'>
      {cards.map((card, i) => <TicCardDisplay
        key={i}
        card={card}
        selected={card.id == selectedCard?.id}
      ></TicCardDisplay>)}
    </div>
  </HandContext.Provider>;
}
