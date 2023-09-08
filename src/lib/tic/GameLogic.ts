import { TicCard } from "@/lib/tic/types/TicCard";
import { TicGameState } from "@/lib/tic/types/TicGameState";
import { TicMarble } from "@/lib/tic/types/TicMarble";
import { v4 } from "uuid";

function generateMarbles(player: number, color: string): TicMarble[] {
  return [
    { id: v4(), color, player, },
    { id: v4(), color, player, },
    { id: v4(), color, player, },
    { id: v4(), color, player, }
  ];
}

export function generateNewGame(): TicGameState {
  return {
    deck: [],
    hands: [[], [], [], []],
    board: {
      homes: [
        generateMarbles(1, '#ff0000'),
        generateMarbles(2, '#00ff00'),
        generateMarbles(3, '#0000ff'),
        generateMarbles(4, '#ffff00'),
      ],
      goals: [],
      field: [],
    },
    currentPlayer: 1
  };
}