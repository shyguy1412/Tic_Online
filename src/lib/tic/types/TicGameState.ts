import { TicBoardState } from "@/lib/tic/types/TicBoardState";
import { TicCard } from "@/lib/tic/types/TicCard";

export type TicGameState = {
  deck: TicCard[],
  currentPlayer: number,
  hands: [TicCard[], TicCard[], TicCard[], TicCard[]];
  board: TicBoardState,
  undoBuffer?: TicBoardState
};