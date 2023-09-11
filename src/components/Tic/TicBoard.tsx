import { h } from "preact";
import { TicHome } from "@/components/Tic/TicHome";
import { TicCenter } from "@/components/Tic/TicCenter";
import { TicFields } from "@/components/Tic/TicFields";
import { TicBoardState } from "@/lib/tic/types/TicBoardState";
import { TicGoal } from "@/components/Tic/TicGoal";

import '@/components/Tic/style/Tic.css';
import { useContext } from "preact/hooks";
import { TicGameStateContext } from "@/pages/room/{roomID}";

type Props = {
};

export function TicBoard({ }: Props) {

  const game = useContext(TicGameStateContext);


  return <div className="tic-board">
    <div className="tic-home-wrapper">
      <TicHome marbles={game?.board?.homes[0] ?? []}></TicHome>
      <TicHome marbles={game?.board?.homes[1] ?? []}></TicHome>
      <TicHome marbles={game?.board?.homes[2] ?? []}></TicHome>
      <TicHome marbles={game?.board?.homes[3] ?? []}></TicHome>
    </div>

    <TicFields></TicFields>

    <div className="tic-goal-wrapper">
      <TicGoal marbles={game?.board?.goals[0] ?? []}></TicGoal>
      <TicGoal marbles={game?.board?.goals[1] ?? []}></TicGoal>
      <TicGoal marbles={game?.board?.goals[2] ?? []}></TicGoal>
      <TicGoal marbles={game?.board?.goals[3] ?? []}></TicGoal>
    </div>

    <TicCenter card={game?.board?.center}></TicCenter>

  </div>;
}