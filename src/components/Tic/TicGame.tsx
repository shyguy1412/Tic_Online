import { TicBoard } from "@/components/Tic/TicBoard";
import { TicHand } from "@/components/Tic/TicHand";
import { TicBoardState } from "@/lib/tic/types/TicBoardState";
import { h } from "preact";

type Props = {
  state?: TicBoardState;
};

export function TicGame({ state }: Props) {
  return <div className="tic-game-wrapper">
    <TicBoard
      state={state ?? {
        homes: [],
        fields: [],
        goals: []
      }}
    ></TicBoard>

    <TicHand
      cards={[
        { id: 1, type: 'enter', value: 1 },
        // { id: 2, type: 'number', value: 2 },
        // { id: 3, type: 'number', value: 3 },
        { id: 4, type: 'backwards', value: 4 },
        // { id: 5, type: 'number', value: 5 },
        { id: 6, type: 'number', value: 6 },
        { id: 7, type: 'split', value: 7 },
        { id: 8, type: 'skip', value: 8 },
        // { id: 9, type: 'number', value: 9 },
        // { id: 10, type: 'number', value: 10 },
        // { id: 11, type: 'number', value: 12 },
        { id: 12, type: 'enter', value: 13 },
        { id: 13, type: 'swap' },
        { id: 14, type: 'undo' },
        { id: 15, type: 'mindcontrol' },
        { id: 16, type: 'first_aid' },
        { id: 17, type: 'dash_attack' },
        { id: 18, type: 'rotate' },
      ]}
    ></TicHand>
  </div>;
}