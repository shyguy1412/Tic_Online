import { cycleArray } from "@/components/Tic/lib/CycleArray";
import { GameManagerContext } from "@/components/Tic/TicGame";
import { TicMarbleSlot } from "@/components/Tic/TicMarbleSlot";
import { FunctionComponent, h, JSX } from "preact";
import { useContext } from "preact/hooks";

type Props = {

};

export function TicFields({ }: Props) {

  const [GameState] = useContext(GameManagerContext);

  return <div className="tic-fields">
    {
      GameState?.board?.field.map((m, i) => <TicMarbleSlot marble={m} index={i + ((((GameState?.player ?? 0) + 2) % 4) * 15)} key={i}></TicMarbleSlot>)
    }
  </div>;
}