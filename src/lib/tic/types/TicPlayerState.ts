import { TicCard } from "@/lib/tic/types/TicCard";

export type TicPlayerState = {
  type: 'wait' | 'choose';
} | {
  type: 'play',
  card: TicCard,
  meta: any;
};
