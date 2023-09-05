import { model, Schema } from 'mongoose';

interface IRoom {
  roomID: number,
  users: {
    name: string,
    id: string;
  }[];
}

const roomSchema = new Schema<IRoom>({
  roomID: Number,
  users: [{ name: String, id: Number }]
});

export const Room = model("Room", roomSchema);