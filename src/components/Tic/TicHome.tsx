import { TicMarbleSlot } from "@/components/Tic/TicMarbleSlot";
import { TicMarble } from "@/lib/tic/types/TicMarble";
import { h } from "preact";

type Props = {
  marbles: TicMarble[];
};

export function TicHome({ marbles }: Props) {
  return <div className='tic-home'>
    <TicMarbleSlot marble={marbles[0]}></TicMarbleSlot>
    <TicMarbleSlot marble={marbles[1]}></TicMarbleSlot>
    <TicMarbleSlot marble={marbles[2]}></TicMarbleSlot>
    <TicMarbleSlot marble={marbles[3]}></TicMarbleSlot>
  </div>;
}
