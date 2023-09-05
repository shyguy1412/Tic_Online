import { Marble } from "@/lib/tic/Marble";

export type TicGameState = {
  homes: Marble[][];
  field: Marble[];
  currentPlayer: string;
};