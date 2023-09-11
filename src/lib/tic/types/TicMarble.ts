export interface TicMarble {
  color: string;
  id: string;
  player: number;
  meta?: Partial<{
    hasMoved: boolean;
    home: boolean;
    done: boolean;
    pos: number;
  }>;
}