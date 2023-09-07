import { TicMarble } from "@/lib/tic/types/TicMarble";

export type TicGameState = {
  homes: TicMarble[][];
  goals: TicMarble[][];
  field: TicMarble[];
  currentPlayer: string;

};