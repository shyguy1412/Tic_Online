import { h } from "preact";
import { TicHome } from "@/components/Tic/TicHome";
import { TicCenter } from "@/components/Tic/TicCenter";
import { TicFields } from "@/components/Tic/TicFields";
import { TicBoardState } from "@/lib/tic/types/TicBoardState";
import { TicGoal } from "@/components/Tic/TicGoal";

import '@/components/Tic/style/Tic.css';

type Props = {
  board: TicBoardState;
};

export function TicBoard({ board }: Props) {

  return <div className="tic-board">
    <div className="tic-home-wrapper">
      <TicHome marbles={board.homes[0] ?? []}></TicHome>
      <TicHome marbles={board.homes[1] ?? []}></TicHome>
      <TicHome marbles={board.homes[2] ?? []}></TicHome>
      <TicHome marbles={board.homes[3] ?? []}></TicHome>
    </div>

    <TicFields></TicFields>

    <div className="tic-goal-wrapper">
      <TicGoal marbles={board.goals[0] ?? []}></TicGoal>
      <TicGoal marbles={board.goals[1] ?? []}></TicGoal>
      <TicGoal marbles={board.goals[2] ?? []}></TicGoal>
      <TicGoal marbles={board.goals[3] ?? []}></TicGoal>
    </div>
    
    <TicCenter card={board.center}></TicCenter>

  </div>;
}