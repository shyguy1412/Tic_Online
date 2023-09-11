import { TicBoard } from "@/components/Tic/TicBoard";
import { TicHand } from "@/components/Tic/TicHand";
import { TicBoardState } from "@/lib/tic/types/TicBoardState";
import { TicCard } from "@/lib/tic/types/TicCard";
import { TicPlayerState } from "@/lib/tic/types/TicPlayerState";
import { h } from "preact";

type Props = {
  board?: TicBoardState;
  hand?: TicCard[];
  state?: TicPlayerState;
};

export function TicGame({ board, hand, state }: Props) {
  return <div className="tic-game-wrapper">
    <TicBoard
      board={board ?? {
        homes: [],
        field: [],
        goals: [],
        center: undefined
      }}
    ></TicBoard>

    <TicHand
      cards={hand ?? []}
      state={state ?? { type: 'wait' }}
    ></TicHand>
  </div>;
}