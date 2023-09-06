import { TicMarble } from "@/components/Tic/types/TicMarble";
import { h } from "preact";

type Props = {
  marble?: TicMarble;
  index?: number;
};

export function TicMarbleSlot({ marble, index }: Props) {
  return <div className='tic-marble-slot' style={{
    backgroundColor: marble?.color,
    '--marble-index': index
  }}>
  </div>;
}