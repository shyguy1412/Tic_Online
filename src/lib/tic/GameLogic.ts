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
    { id: v4(), color, player }
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
        generateMarbles(1, '#ff0000'),
        generateMarbles(2, '#00ff00'),
        generateMarbles(3, '#0000ff'),
        generateMarbles(4, '#ffff00'),
      ],
      goals: [generateSlots(4), generateSlots(4), generateSlots(4), generateSlots(4)],
      field: generateSlots(60),
      center: undefined
    },
    currentPlayer: 1
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
      hasMoved: m.meta?.hasMoved,
      pos: state.board.field.indexOf(m)
    }
  }));
  return marbles;
}

function canMarblesMove(marbles: TicMarble[], amount: number, state: TicGameState) {
  const player = marbles[0].player;
  return marbles.some(m => {
    if (state.board.homes[player].some(h => h.id == m.id)) return false;
    const canMoveIntoGoal = canMoveMarbleIntoGoal(m, amount, state);
    const canMove = canMoveMarbleBy(m, amount, state);
    const canMoveInGoal = canMoveMarbleInsideGoal(m, amount, state);
    if (canMove || canMoveIntoGoal || canMoveInGoal) return true;
  });
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

export function getPlayability(userID: string, room: IRoom): CardPlayabilityMap {
  const player = getUserPlayer(userID, room);
  const state = room.state;

  let marbles = state.board.goals[player].length < 4 ? //player is not done
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
          reasons: ["You do not have a marble in play", "None of your marbles can move {{value}} spaces"]
        };
      }
      if (!canMarblesMove(marbles, value, state)) { // Marbles need to be able to move the amount of spaces
        return {
          playable: false,
          reasons: [`None of your marbles can move {{value}} ${value > 1 ? 'spaces' : 'space'}`]
        };
      }
      return {
        playable: true
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
        playable: true
      };
    },
    enter: (value) => {
      if (!marbleInStartArea) { //without a marble to enter, the enter card is the same as a number
        const playability = playabilityMap['number'](value);
        if (!playability.playable) {
          playability.reasons.unshift("You do not have any marbles left that could enter");
        }
        return playability;
      }
      return {
        playable: true
      };
    },
    backwards: (value) => {
      return playabilityMap['number'](value * -1);
    },
    skip: (value) => {
      if (!marbleInPlayingArea) { //You need a marble in play to play a number card
        return {
          playable: false,
          reasons: ["You do not have a marble in play"]
        };
      }
      return {
        playable: true
      };
    },
    first_aid: (value) => {
      return {
        playable: true
      };
    },
    mindcontrol: (value) => {
      return {
        playable: true
      };
    },
    dash_attack: (value) => {
      if (!marbleInPlayingArea) { //You need a marble in play to play a number card
        return {
          playable: false,
          reasons: ["You do not have a marble in play"]
        };
      }
      return {
        playable: true
      };
    },
    rotate: (value) => {
      return {
        playable: true
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
          reasons: ["There need to be at least 2 marbles in order to swap them"]
        };
      }
      return {
        playable: true
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

  const playability: CardPlayabilityMap = state.hands[player]
    .map(({ type, value, id }) => ({
      id,
      playability: playabilityMap[type](value ?? -1)
    })).reduce<CardPlayabilityMap>((prev, cur) => { prev[cur.id] = cur.playability; return prev; }, {});

  return playability;
};
