import { TicCardDisplay } from "@/components/Tic/TicCardDisplay";
import { TicCard } from "@/lib/tic/types/TicCard";
import { h } from "preact";

type Props = {
  card?: TicCard;
};

export function TicCenter({ card }: Props) {
  return <div className="tic-center">
    {!card?.type || <TicCardDisplay card={card} selected={false}></TicCardDisplay>}  </div>;
}