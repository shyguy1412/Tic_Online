import { GameManager, GameManagerReducer } from "@/components/Tic/lib/GameManager";
import { TicBoard } from "@/components/Tic/TicBoard";
import { TicHand } from "@/components/Tic/TicHand";
import { CardPlayabilityMap } from "@/lib/tic/types/PlayabilityResult";
import { TicBoardState } from "@/lib/tic/types/TicBoardState";
import { TicCard } from "@/lib/tic/types/TicCard";
import { TicPlayerState } from "@/lib/tic/types/TicPlayerState";
import { h, createContext } from "preact";
import { useEffect, useReducer } from "preact/hooks";
import { useServerSentEvents } from "squid-ssr/hooks/client";
import config from '@/config';

const {
  API_PREFIX
} = config;

type Props = {
  hand?: TicCard[];
  state?: TicPlayerState;
  board?: TicBoardState;
  playability?: CardPlayabilityMap;
  roomID: string;
  player: number;
  currentPlayer: number;
};

export const GameManagerContext = createContext<GameManager | []>([]);

export function TicGame({ hand, state, board, playability, roomID, player, currentPlayer }: Props) {

  const GameManager = useReducer(GameManagerReducer, {
    cardsActive: state?.type == 'choose',
    selectedCard: null,
    hand,
    state,
    board,
    playability,
    player,
    currentPlayer
  });

  const sse = useServerSentEvents(`${API_PREFIX}/${roomID}`);

  useEffect(() => {
    if (!sse) return;

    sse.addEventListener('board', ({ detail: data }) => {
      GameManager[1]({
        action: "set-board",
        data: {...data, source:'event'}
      });
    });

    sse.addEventListener('hand', ({ detail: data }) => {
      GameManager[1]({
        action: "set-hand",
        data
      });
    });

    sse.addEventListener('state', ({ detail: data }) => {
      GameManager[1]({
        action: "set-state",
        data
      });
    });

    sse.addEventListener('playability', ({ detail: data }) => {
      GameManager[1]({
        action: "set-playability",
        data
      });
    });


  }, [sse]);

  useEffect(() => {
    GameManager[1]({
      action: 'init',
      data: GameManager
    });
  }, []);

  return <GameManagerContext.Provider value={GameManager}>
    <div className="tic-game-wrapper">
      <TicBoard></TicBoard>

      <TicHand></TicHand>
    </div>
  </GameManagerContext.Provider>;
};