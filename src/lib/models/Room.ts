import { TicGameState } from '@/lib/tic/types/TicGameState';
import mongoose from 'mongoose';

interface IRoom {
  roomID: String,
  users: {
    name: string,
    id: string;
  }[];
  state: TicGameState;
}

const RoomSchema = new mongoose.Schema<IRoom>({
  roomID: {
    type: String,
    unique: true,
    index: true
  },
  users: [{ name: String, id: String }],
  state: {
    type: Object
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