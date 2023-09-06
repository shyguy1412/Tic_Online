import { TicCard } from "@/components/Tic/types/TicCard";

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
  : T extends 'select-card' ? TicCard
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
      selectedCard: data,
    };
  },
  "play-card": function (state: HandManagerState, { action, data }: HandManagerDispatch<"play-card">): HandManagerState {
    throw new Error("Function not implemented.");
  }
};

export function HandManagerReducer(state: HandManagerState, dispatch: HandManagerDispatch) {
  return (ActionHandler[dispatch.action] as HandManagerActionHandler<typeof dispatch['action']>)(state, dispatch);
}