import { h } from "preact";
import { TicHome } from "@/components/Tic/TicHome";
import { TicCenter } from "@/components/Tic/TicCenter";
import { TicFields } from "@/components/Tic/TicFields";
import { TicBoardState } from "@/lib/tic/types/TicBoardState";
import { TicGoal } from "@/components/Tic/TicGoal";

import '@/components/Tic/style/Tic.css';
import { useContext } from "preact/hooks";
import { GameManagerContext } from "@/components/Tic/TicGame";

type Props = {
};

export function TicBoard({ }: Props) {

  const [GameState] = useContext(GameManagerContext);


  return <div className="tic-board">
    <TicFields></TicFields>


    <div className="tic-goal-wrapper">
      <TicGoal marbles={GameState?.board?.goals[0] ?? []}></TicGoal>
      <TicGoal marbles={GameState?.board?.goals[1] ?? []}></TicGoal>
      <TicGoal marbles={GameState?.board?.goals[2] ?? []}></TicGoal>
      <TicGoal marbles={GameState?.board?.goals[3] ?? []}></TicGoal>
    </div>

    <div className="tic-home-wrapper">
      <TicHome marbles={GameState?.board?.homes[0] ?? []}></TicHome>
      <TicHome marbles={GameState?.board?.homes[1] ?? []}></TicHome>
      <TicHome marbles={GameState?.board?.homes[2] ?? []}></TicHome>
      <TicHome marbles={GameState?.board?.homes[3] ?? []}></TicHome>
    </div>

    <TicCenter card={GameState?.board?.center}></TicCenter>

  </div>;
}