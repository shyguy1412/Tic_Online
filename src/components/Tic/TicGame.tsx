import { TicBoard } from "@/components/Tic/TicBoard";
import { TicHand } from "@/components/Tic/TicHand";
import { TicBoardState } from "@/lib/tic/types/TicBoardState";
import { TicCard } from "@/lib/tic/types/TicCard";
import { TicPlayerState } from "@/lib/tic/types/TicPlayerState";
import { h } from "preact";

type Props = {};

export function TicGame({ }: Props) {
  return <div className="tic-game-wrapper">
    <TicBoard></TicBoard>

    <TicHand></TicHand>
  </div>;
}