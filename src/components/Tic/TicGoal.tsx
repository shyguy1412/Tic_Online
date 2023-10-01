import { TicMarbleSlot } from "@/components/Tic/TicMarbleSlot";
import { TicMarble } from "@/lib/tic/types/TicMarble";
import { h } from "preact";

type Props = {
  marbles: (TicMarble|null)[];
  owner: number;
};

export function TicGoal({ marbles }: Props) {
  return <div className='tic-goal'>
    <TicMarbleSlot marble={marbles[0]}></TicMarbleSlot>
    <TicMarbleSlot marble={marbles[1]}></TicMarbleSlot>
    <TicMarbleSlot marble={marbles[2]}></TicMarbleSlot>
    <TicMarbleSlot marble={marbles[3]}></TicMarbleSlot>
  </div>;
}
