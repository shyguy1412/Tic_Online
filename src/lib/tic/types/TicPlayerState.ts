import { TicCard } from "@/lib/tic/types/TicCard";
import { TicMarble } from "@/lib/tic/types/TicMarble";

export type TicPlayerState = {
  type: 'wait' | 'choose';
} | {
  type: 'play',
  card: TicCard,
  validMarbles: string[];
  meta: any;
};
