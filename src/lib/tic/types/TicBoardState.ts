import { TicMarble } from "@/lib/tic/types/TicMarble";

export type TicBoardState = {
  homes: TicMarble[][];
  goals: TicMarble[][];
  field: TicMarble[];
};