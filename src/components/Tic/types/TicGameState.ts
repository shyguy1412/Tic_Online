import { TicMarble } from "@/components/Tic/types/TicMarble";

export type TicGameState = {
  homes: TicMarble[][];
  goals: TicMarble[][];
  field: TicMarble[];
  currentPlayer: string;

};