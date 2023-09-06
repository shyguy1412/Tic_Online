import { TicCardDisplay } from "@/components/Tic/cards/TicCard";
import { HandManager, HandManagerReducer } from "@/components/Tic/lib/HandManager";
import { TicCard } from "@/components/Tic/types/TicCard";
import { createContext } from "preact";
import { h } from "preact";
import { useReducer } from "preact/hooks";

type Props = {
  cards: TicCard[];
};

export const HandContext = createContext<HandManager | null>(null);

export function TicHand({ cards }: Props) {

  const HandManager = useReducer(HandManagerReducer, {
    cardsActive: true,
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
