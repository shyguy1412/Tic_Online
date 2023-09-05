import { TicMarbleSlot } from "@/components/Tic/TicMarbleSlot";
import { Marble } from "@/components/Tic/types/Marble";
import { h } from "preact";

type Props = {
  marbles: Marble[];
};

export function TicGoal({ marbles }: Props) {
  return <div className='tic-goal'>
    <TicMarbleSlot marble={marbles[0]}></TicMarbleSlot>
    <TicMarbleSlot marble={marbles[1]}></TicMarbleSlot>
    <TicMarbleSlot marble={marbles[2]}></TicMarbleSlot>
    <TicMarbleSlot marble={marbles[3]}></TicMarbleSlot>
  </div>;
}
