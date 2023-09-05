import { h } from "preact";
import { TicHome } from "@/components/Tic/TicHome";
import { TicCenter } from "@/components/Tic/TicCenter";
import { TicFields } from "@/components/Tic/TicFields";
import { TicGameState } from "@/components/Tic/types/State";
import { TicGoal } from "@/components/Tic/TicGoal";

import '@/components/Tic/style/Tic.css';

type Props = {
  state: TicGameState;
};

export function TicBoard({ state }: Props) {

  return <div className="tic-board">
    <div className="tic-home-wrapper">
      <TicHome marbles={state.homes[0] ?? []}></TicHome>
      <TicHome marbles={state.homes[1] ?? []}></TicHome>
      <TicHome marbles={state.homes[2] ?? []}></TicHome>
      <TicHome marbles={state.homes[3] ?? []}></TicHome>
    </div>

    <div className="tic-goal-wrapper">
      <TicGoal marbles={state.goals[0] ?? []}></TicGoal>
      <TicGoal marbles={state.goals[1] ?? []}></TicGoal>
      <TicGoal marbles={state.goals[2] ?? []}></TicGoal>
      <TicGoal marbles={state.goals[3] ?? []}></TicGoal>
    </div>

    <TicFields></TicFields>
    <TicCenter></TicCenter>

  </div>;
}