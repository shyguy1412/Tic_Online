import { h } from "preact";
import { TicHome } from "@/components/Tic/TicHome";
import { TicCenter } from "@/components/Tic/TicCenter";
import { TicFields } from "@/components/Tic/TicFields";
import { Marble } from "@/lib/tic/Marble";
import { TicGameState } from "@/lib/tic/State";

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

    <TicFields></TicFields>
    <TicCenter></TicCenter>

  </div>;
}