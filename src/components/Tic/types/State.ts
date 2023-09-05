import { Marble } from "@/components/Tic/types/Marble";

export type TicGameState = {
  homes: Marble[][];
  goals: Marble[][];
  field: Marble[];
  currentPlayer: string;

};