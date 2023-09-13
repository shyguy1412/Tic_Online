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
      GameState?.board?.field.map((m, i) => <TicMarbleSlot marble={m} index={i} key={i}></TicMarbleSlot>)
    }
  </div>;
}