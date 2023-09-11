import { TicCard } from "@/lib/tic/types/TicCard";
import { TicMarble } from "@/lib/tic/types/TicMarble";

export type TicBoardState = {
  homes: TicMarble[][];
  goals: (TicMarble|null)[][];
  field: (TicMarble|null)[];
  center: TicCard | undefined;
};