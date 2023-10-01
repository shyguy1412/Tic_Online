import { TicCard } from "@/lib/tic/types/TicCard";

export type TicPlayerState = {
  type: 'wait' | 'choose';
} | {
  type: 'play',
  card: TicCard,
  validMarbles: string[];
  meta: any;
};
