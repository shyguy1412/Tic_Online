import { GameManagerContext } from "@/components/Tic/TicGame";
import { TicMarbleSlot } from "@/components/Tic/TicMarbleSlot";
import { TicMarble } from "@/lib/tic/types/TicMarble";
import { h } from "preact";
import { useContext } from "preact/hooks";

type Props = {
  marbles: TicMarble[];
  owner: number;
};

export function TicHome({ marbles, owner }: Props) {

  const [GameState] = useContext(GameManagerContext);

  const player = GameState?.player ?? -1;
  const currentPlayer = GameState?.currentPlayer ?? -1;

  const showSkipButton = player >= 0 &&
    player == currentPlayer &&
    GameState?.board?.center?.type == 'skip' &&
    GameState.state?.type == 'play' &&
    (player + 1) % 4 == owner;

  return <div className='tic-home'>
    <TicMarbleSlot marble={marbles[0]}></TicMarbleSlot>
    <TicMarbleSlot marble={marbles[1]}></TicMarbleSlot>
    <TicMarbleSlot marble={marbles[2]}></TicMarbleSlot>
    <TicMarbleSlot marble={marbles[3]}></TicMarbleSlot>
  </div>;
}
