import { TicGameState } from '@/lib/tic/types/TicGameState';
import { TicPlayerState } from '@/lib/tic/types/TicPlayerState';
import mongoose from 'mongoose';

export interface IRoom {
  roomID: String,
  users: {
    name: string;
    userID: string;
    player: number;
    state: TicPlayerState;
  }[];
  state: TicGameState;
}

const RoomSchema = new mongoose.Schema<IRoom>({
  roomID: {
    type: String,
    unique: true,
    index: true
  },
  users: [{
    name: String,
    userID: String,
    player: Number,
    state: {
      type: { type: String },
      card: {
        type: Object,
        required: false
      },
      meta: {
        type: Object,
        required: false
      }
    }
  }],
  state: {
    type: {
      board: {
        homes: [[Object]],
        goals: [[Object]],
        field: [Object],
        center: Object
      },
      hands: [[Object]],
      currentPlayer: Number,
      deck: [Object]
    }
  }
});

let RoomModel: mongoose.Model<IRoom>;

try {
  RoomModel = mongoose.model<IRoom>("Room", RoomSchema);
  console.log('Registered Room Model');
} catch (_) {
  RoomModel = mongoose.models['Room'];
  console.warn('Did not recompile Room Model');
}

export const Room = RoomModel;

export function getUser(userID: string, room: IRoom) {
  return room.users.find(u => u.userID == userID);
}

export function getUserPlayer(userID: string, room: IRoom) {
  return room.users.find(u => u.userID == userID)?.player ?? -1;
}

export function getUserState(userID: string, room: IRoom): TicPlayerState {
  return room.users.find(u => u.userID == userID)?.state ?? { type: 'wait' };
}

export function getUserHome(userID: string, room: IRoom) {
  const player = getUserPlayer(userID, room);
  if (player < 0) return [];
  return room.state.board.homes[player];
}

export function getUserHand(userID: string, room: IRoom) {
  const player = getUserPlayer(userID, room);
  if (player < 0) return [];
  return room.state.hands[player];
}