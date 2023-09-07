import { TicCard } from "@/lib/tic/types/TicCard";
import config from "@/config";

const {
  API_PREFIX
} = config;

export interface HandManagerState {
  cardsActive: boolean,
  selectedCard: TicCard | null;
  // hands: Parameters<typeof PlasmaHand>[0][];
}

export type HandManager = [HandManagerState, React.Dispatch<HandManagerDispatch<HandManagerAction>>];

export type HandManagerAction = 'select-card' | 'play-card';

export interface HandManagerDispatch<T extends HandManagerAction = HandManagerAction> {
  action: T;
  data: T extends 'select-card' ? TicCard | null
  : T extends 'play-card' ? TicCard
  : never;
};

type HandManagerActionHandlerMap = {
  [key in HandManagerDispatch['action']]: HandManagerActionHandler<key>
};

type HandManagerActionHandler<T extends HandManagerAction> = (state: HandManagerState, { action, data }: HandManagerDispatch<T>) => HandManagerState;

const ActionHandler: HandManagerActionHandlerMap = {
  "select-card": function (state: HandManagerState, { action, data }: HandManagerDispatch<"select-card">): HandManagerState {
    return {
      ...state,
      selectedCard: state.cardsActive ? data : state.selectedCard,
    };
  },
  "play-card": function (state: HandManagerState, { action, data }: HandManagerDispatch<"play-card">): HandManagerState {
    fetch(`${API_PREFIX}/play`, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    // throw new Error("Function not implemented.");
    return {
      ...state,
      cardsActive: false
    };
  }
};

export function HandManagerReducer(state: HandManagerState, dispatch: HandManagerDispatch) {
  return (ActionHandler[dispatch.action] as HandManagerActionHandler<typeof dispatch['action']>)(state, dispatch);
}