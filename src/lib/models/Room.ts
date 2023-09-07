import { model, Schema } from 'mongoose';

interface IRoom {
  roomID: String,
  users: {
    name: string,
    id: string;
  }[];
}

const roomSchema = new Schema<IRoom>({
  roomID: {
    type: String,
    unique: true,
    index: true
  },
  users: [{ name: String, id: String }]
});

export const Room = model("Room", roomSchema);