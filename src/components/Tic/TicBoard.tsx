import { h } from "preact";
import { TicHome } from "@/components/Tic/TicHome";
import { TicCenter } from "@/components/Tic/TicCenter";
import { TicFields } from "@/components/Tic/TicFields";
import { TicBoardState } from "@/lib/tic/types/TicBoardState";
import { TicGoal } from "@/components/Tic/TicGoal";

import '@/components/Tic/style/Tic.css';
import { useContext } from "preact/hooks";
import { GameManagerContext } from "@/components/Tic/TicGame";
import { cycleArray } from "@/components/Tic/lib/CycleArray";

type Props = {
};

export function TicBoard({ }: Props) {

  const [GameState] = useContext(GameManagerContext);


  return <div className="tic-board">
    <TicFields></TicFields>


    <div className="tic-goal-wrapper">
      {
        cycleArray(GameState?.board?.goals.map((m, i) => <TicGoal marbles={m} owner={i} key={i}></TicGoal>) ?? [], ((((GameState?.player ?? 0) + 2) % 4)))
      }
    </div>

    <div className="tic-home-wrapper">
      {
        cycleArray(GameState?.board?.homes.map((m, i) => <TicHome marbles={m} owner={i} key={i}></TicHome>) ?? [], ((((GameState?.player ?? 0) + 2) % 4)))
      }
    </div>

    <TicCenter card={GameState?.board?.center}></TicCenter>

  </div>;
}