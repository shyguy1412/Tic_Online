import { CardPlayabilityMap } from "@/lib/tic/types/PlayabilityResult";
import { TicBoardState } from "@/lib/tic/types/TicBoardState";
import { TicCard } from "@/lib/tic/types/TicCard";
import { TicPlayerState } from "@/lib/tic/types/TicPlayerState";
import config from "@/config";

const {
  API_PREFIX
} = config;


export interface GameManagerState {
  cardsActive: boolean;
  selectedCard: TicCard | null;
  hand?: TicCard[];
  state?: TicPlayerState;
  board?: TicBoardState;
  playability?: CardPlayabilityMap;
  self?: GameManager[1];
}

export type GameManager = [GameManagerState, React.Dispatch<GameManagerDispatch<GameManagerAction>>];

export type GameManagerAction =
  'select-card' |
  'play-card' |
  'set-hand' |
  'set-state' |
  'set-board' |
  'set-playability' |
  // 'activate-cards' |
  'init';


export interface GameManagerDispatch<T extends GameManagerAction = GameManagerAction> {
  action: T;
  data: T extends 'select-card' ? TicCard | null
  : T extends 'play-card' ? TicCard
  : T extends 'init' ? GameManager
  : T extends 'set-hand' ? GameManagerState['hand']
  : T extends 'set-state' ? GameManagerState['state']
  : T extends 'set-board' ? GameManagerState['board']
  : T extends 'set-playability' ? GameManagerState['playability']
  : never;
};

type GameManagerActionHandlerMap = {
  [key in GameManagerDispatch['action']]: GameManagerActionHandler<key>
};

type GameManagerActionHandler<T extends GameManagerAction> = (state: GameManagerState, { action, data }: GameManagerDispatch<T>) => GameManagerState;

const ActionHandler: GameManagerActionHandlerMap = {
  "select-card": function (state: GameManagerState, { action, data }: GameManagerDispatch<"select-card">): GameManagerState {
    return {
      ...state,
      selectedCard: state.cardsActive ? data : state.selectedCard
    };
  },
  "play-card": function (state: GameManagerState, { action, data }: GameManagerDispatch<"play-card">): GameManagerState {
    if (!state.self)
      throw new Error("GameManager is not initilized");

    fetch(`${API_PREFIX}/play`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    // .then(res => res.ok ? state.self({
    // }) : state.self({
    // }));
    return {
      ...state,
      selectedCard: null,
      cardsActive: false
    };
  },
  init: function (state: GameManagerState, { action, data }: GameManagerDispatch<"init">): GameManagerState {
    return {
      ...state,
      self: data[1]
    };
  },
  "set-hand": function (state: GameManagerState, { action, data }: GameManagerDispatch<"set-hand">): GameManagerState {
    return {
      ...state,
      hand: data
    };
  },
  "set-state": function (state: GameManagerState, { action, data }: GameManagerDispatch<"set-state">): GameManagerState {
    return {
      ...state,
      state: data
    };
  },
  "set-board": function (state: GameManagerState, { action, data }: GameManagerDispatch<"set-board">): GameManagerState {
    return {
      ...state,
      board: data
    };
  },
  "set-playability": function (state: GameManagerState, { action, data }: GameManagerDispatch<"set-playability">): GameManagerState {
    return {
      ...state,
      playability: data
    };
  }
};

export function GameManagerReducer(state: GameManagerState, dispatch: GameManagerDispatch) {
  return (ActionHandler[dispatch.action] as GameManagerActionHandler<typeof dispatch['action']>)(state, dispatch);
}