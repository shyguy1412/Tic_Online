import { h } from "preact";
import '@/style/TicBoard.css';
import { TicHome } from "@/components/Tic/TicHome";
import { TicCenter } from "@/components/Tic/TicCenter";
import { TicFields } from "@/components/Tic/TicFields";

type Props = {

}

export function TicBoard({}:Props){

  return <div className="tic-board">
    <TicHome></TicHome>
    <TicHome></TicHome>
    <TicHome></TicHome>
    <TicHome></TicHome>

    <TicCenter></TicCenter>

    <TicFields></TicFields>
  </div>
}