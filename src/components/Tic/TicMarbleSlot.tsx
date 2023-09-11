import { TicMarble } from "@/lib/tic/types/TicMarble";
import { h } from "preact";

type Props = {
  marble: TicMarble | null;
  index?: number;
};

export function TicMarbleSlot({ marble, index }: Props) {
  return <div className='tic-marble-slot' style={{
    backgroundColor: marble?.color,
    '--marble-index': index
  }}>
  </div>;
}