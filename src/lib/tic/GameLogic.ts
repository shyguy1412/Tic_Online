import { getUserPlayer } from "@/lib/models/Room";
import { CardPlayabilityMap, PlayabilityResult } from "@/lib/tic/types/PlayabilityResult";
import { TicCard } from "@/lib/tic/types/TicCard";
import { TicGameState } from "@/lib/tic/types/TicGameState";
import { TicMarble } from "@/lib/tic/types/TicMarble";
import { v4 } from "uuid";
import type { IRoom } from '@/lib/models/Room';

function generateMarbles(player: number, color: string): TicMarble[] {
  return [
    { id: v4(), color, player },
    { id: v4(), color, player },
    { id: v4(), color, player },
    // { id: v4(), color, player }
  ];
}


function generateSlots(amount: number) {
  const slots: (TicMarble | null)[] = [];
  for (let i = 0; i < amount; i++) {
    slots.push(null);
  }
  return slots;
}

export function generateNewGame(): TicGameState {
  return {
    deck: [],
    hands: [[
      { id: v4(), type: 'enter', value: 1 },
      // { id: v4(), type: 'number', value: 2 },
      // { id: v4(), type: 'number', value: 3 },
      { id: v4(), type: 'backwards', value: 4 },
      // { id: v4(), type: 'number', value: 5 },
      { id: v4(), type: 'number', value: 6 },
      { id: v4(), type: 'split', value: 7 },
      { id: v4(), type: 'skip', value: 8 },
      // { id: v4(), type: 'number', value: 9 },
      // { id: v4(), type: 'number', value: 10 },
      // { id: v4(), type: 'number', value: 12 },
      { id: v4(), type: 'enter', value: 13 },
      { id: v4(), type: 'swap' },
      { id: v4(), type: 'undo' },
      { id: v4(), type: 'mindcontrol' },
      { id: v4(), type: 'first_aid' },
      { id: v4(), type: 'dash_attack' },
      { id: v4(), type: 'rotate' },
    ], [], [], []],
    board: {
      homes: [
        generateMarbles(0, '#ff0000'),
        generateMarbles(1, '#00ff00'),
        generateMarbles(2, '#0000ff'),
        generateMarbles(3, '#ffff00'),
      ],
      goals: [[...generateSlots(3), { id: v4(), color: '#ff0000', player: 0 }], [...generateSlots(3), { id: v4(), color: '#00ff00', player: 1 }], [...generateSlots(3), { id: v4(), color: '#0000ff', player: 2 }], [...generateSlots(3), { id: v4(), color: '#ffff00', player: 3 }]],
      field: generateSlots(60),
      center: undefined
    },
    currentPlayer: 0
  };
}

export function getInitialMetaInfo(card: TicCard) {
  switch (card.type) {
    case 'number':
      return {};
    case 'split':
      return { left: card.value };
    case 'enter':
      return {};
    case 'backwards':
      return {};
    case 'skip':
      return {};
    case 'first_aid':
      return {};
    case 'mindcontrol':
      return { state: 'choose' };
    case 'dash_attack':
      return {};
    case 'rotate':
      return {};
    case 'swap':
      return {};
    case 'undo':
      return {};
  }
}

function getTeammate(player: number): number {
  return (player + 2) % 4;
}

function getPlayerMarbles(player: number, state: TicGameState) {
  const marbles: TicMarble[] = [];
  state.board.homes[player].forEach(m => marbles.push({
    ...m,
    meta: {
      home: true
    }
  }));
  state.board.goals[player].filter(m => m?.player == player).forEach(m => m && marbles.push({
    ...m,
    meta: {
      done: true,
      pos: state.board.goals[player].indexOf(m)
    }
  }));
  state.board.field.filter(m => m?.player == player).forEach(m => m && marbles.push({
    ...m,
    meta: {
      hasMoved: m.meta?.hasMoved ?? false,
      pos: state.board.field.indexOf(m)
    }
  }));
  return marbles;
}

function canMarbleMove(marble: TicMarble, amount: number, state: TicGameState) {
  const player = marble.player;
  if (state.board.homes[player].some(h => h.id == marble.id)) return false;
  const canMoveIntoGoal = canMoveMarbleIntoGoal(marble, amount, state);
  const canMove = canMoveMarbleBy(marble, amount, state);
  const canMoveInGoal = canMoveMarbleInsideGoal(marble, amount, state);
  if (canMove || canMoveIntoGoal || canMoveInGoal) return true;
};

function canMoveMarbleInsideGoal(marble: TicMarble, amount: number, state: TicGameState) {
  const player = marble.player;
  const marblePos = marble.meta?.pos;

  if (marblePos == undefined) throw new Error("Marble position unknown");

  const finalPos = marblePos + amount;

  if (amount < 0 && marbleInGoalBetween(finalPos, marblePos - 1, state.board.goals[player])) {
    return true;
  } else if (marbleInGoalBetween(marblePos + 1, finalPos, state.board.goals[player])) {
    return true;
  }
  return false;
}

function marbleInGoalBetween(start: number, stop: number, goal: (TicMarble | null)[]) {
  if (start < 0 || stop >= 4 || stop < start) return false;
  for (let i = start; i <= stop; i++) {
    if (goal[i] != null) {
      return false;
    }
  }
  return true;
}

function checkForMarblesBetween(start: number, offset: number, state: TicGameState) {
  if (offset < 0) { // if moving backwards
    start += offset;
    offset *= -1;
  }

  for (let i = start + 1; i < start + offset; i++) {
    let index = i % 60;
    while (index < 0) {
      index += 60;
    }
    if (state.board.field[index] != null) {
      return false;
    }
  }
  return true;
}

function canMoveMarbleBy(marble: TicMarble, amount: number, state: TicGameState) {
  if (!state.board.field.some(m => m?.id == marble.id)) return false;

  const marblePos = marble.meta?.pos;
  if (marblePos == undefined) throw new Error("Marble position unknown");

  return checkForMarblesBetween(marblePos, amount, state);
}

function distanceFromGoal(marble: TicMarble, forwards: boolean) {
  const marblePos = marble.meta?.pos;
  const entryPoint = marble.player * 15;

  if (marblePos == undefined) throw new Error("Marble position unknown");

  let dist = 0;
  if (forwards) {
    dist = Math.abs((entryPoint + 60) - marblePos) % 60;
  } else {
    dist = Math.abs(marblePos - entryPoint) % 60;
  }
  return dist;
}

function canMoveMarbleIntoGoal(marble: TicMarble, amount: number, state: TicGameState) {
  if (!marble.meta?.hasMoved) return false;// can only enter home if has moved before
  const marblePos = marble.meta?.pos;
  const player = marble.player;
  const distFromGoal = distanceFromGoal(marble, amount > 0);

  if (marblePos == undefined) throw new Error("Marble position unknown");

  if (distFromGoal > Math.abs(amount)) {
    return false;
  }

  const stepsInsideGoal = Math.abs(amount) - distFromGoal;
  return marbleInGoalBetween(0, stepsInsideGoal - 1, state.board.goals[player]);
}

export function getPlayability(userID: string, room: IRoom, card?: TicCard): CardPlayabilityMap {
  const player = getUserPlayer(userID, room);
  const state = room.state;

  let marbles = state.board.goals[player].some(m => !m) ? //player is not done
    getPlayerMarbles(player, state) : getPlayerMarbles(getTeammate(player), state);

  if (marbles.every(m => m.meta?.done)) {
    marbles = getPlayerMarbles(getTeammate(player), state);
  }

  const marbleInGoal = marbles.some(m => m.meta?.done);
  const marbleInPlayingArea = marbles.some(m => !m.meta?.done && !m.meta?.home);
  const marbleInStartArea = marbles.some(m => m.meta?.home);
  const marblesInPlayingArea = state.board.field.filter(f => !!f).length;

  const undoCard = state.undoBuffer?.center;

  const playabilityMap: { [key in TicCard['type']]: (value: number) => PlayabilityResult } = {
    number: (value) => {
      if (!marbleInPlayingArea) { //You need a marble in play to play a number card
        return {
          playable: false,
          reasons: ["You do not have a marble in play"]
        };
      }
      const movableMarbles = marbles.filter(m => canMarbleMove(m, value, state)).map(m => m.id);

      if (movableMarbles.length == 0) { // Marbles need to be able to move the amount of spaces
        return {
          playable: false,
          reasons: [`None of your marbles can move {{value}} ${value > 1 ? 'spaces' : 'space'}`]
        };
      }
      return {
        playable: true,
        marbles: movableMarbles
      };
    },
    split: (value) => {
      if (!marbleInPlayingArea && !marbleInGoal) { // you need a marble in play or in the goal to play a split card
        return {
          playable: false,
          reasons: ["You do not have a marble in play"]
        };
      }
      return {
        playable: true,
        marbles: [...state.board.field, ...state.board.goals[player]]
          .filter(m => m && m.player == player)
          .map(m => m!.id)
      };
    },
    enter: (value) => {
      const homeMarbles = state.board.homes[player].map(m => m.id);
      const playability = playabilityMap['number'](value);

      if (!playability.playable && !marbleInStartArea) {
        playability.reasons.unshift("You do not have any marbles left that could enter");
        return playability;
      }

      const playableMarbles = playability.playable ? playability.marbles : [];
      playableMarbles.push(...homeMarbles);

      return {
        playable: true,
        marbles: playableMarbles
      };
    },
    backwards: (value) => {
      return playabilityMap['number'](value * -1);
    },
    skip: (value) => {
      const playability = playabilityMap['number'](value);

      if (!marbleInPlayingArea) { //You need a marble in play to play a number card
        return {
          playable: false,
          reasons: ["You do not have a marble in play"]
        };
      }

      const playableMarbles = playability.playable ? playability.marbles : [];

      return {
        playable: true,
        marbles: playableMarbles
      };
    },
    first_aid: (value) => {
      return {
        playable: true,
        marbles: []
      };
    },
    mindcontrol: (value) => {
      return {
        playable: true,
        marbles: []
      };
    },
    dash_attack: (value) => {
      if (!marbleInPlayingArea) { //You need a marble in play to play a number card
        return {
          playable: false,
          reasons: ["You do not have a marble in play"]
        };
      }
      if (marblesInPlayingArea < 2){
        return {
          playable: false,
          reasons: ["There need to be at least 2 marbles in play in order to play this card"]
        };
      }
      return {
        playable: true,
        marbles: state.board.field.filter(m => m?.player == player).map(m => m!.id)
      };
    },
    rotate: (value) => {
      return {
        playable: true,
        marbles: []
      };
    },
    swap: (value) => {
      if (!marbleInPlayingArea) { //You need a marble in play to play a number card
        return {
          playable: false,
          reasons: ["You do not have a marble in play"]
        };
      }
      if (marblesInPlayingArea < 2) {
        return {
          playable: false,
          reasons: ["There need to be at least 2 marbles in play in order to play this card"]
        };
      }
      return {
        playable: true,
        marbles: state.board.field.filter(m => !!m).map(m => m!.id)
      };
    },
    undo: (value) => {
      if (!undoCard) {
        return {
          playable: false,
          reasons: ["There is no card to Undo"]
        };
      }
      return playabilityMap[undoCard.type](undoCard.value ?? -1);
    }
  };

  const playability: CardPlayabilityMap = (card ? [card] : state.hands[player])
    .map(({ type, value, id }) => ({
      id,
      playability: playabilityMap[type](value ?? -1),
      type //!DEBUG INFO
    })).reduce<CardPlayabilityMap>((prev, cur) => { prev[cur.id] = cur.playability; prev[cur.id]['type'] = cur.type; return prev; }, {});

  return playability;
};
