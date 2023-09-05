import { Marble } from "@/lib/tic/Marble";
import { h } from "preact";

type Props = {
  marble?: Marble;
  index?: number;
};

export function TicMarbleSlot({ marble, index }: Props) {
  return <div className='tic-marble-slot' style={{
    backgroundColor: marble?.color,
    '--marble-index': index
  }}>
  </div>;
}