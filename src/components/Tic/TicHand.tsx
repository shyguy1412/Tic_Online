import { TicCard } from "@/components/Tic/types/TicCard";
import { h } from "preact";

type Props = {
  cards: TicCard[];
};

export function TicHand({ cards }: Props) {
  return <div className='tic-hand'>
  </div>;
}
