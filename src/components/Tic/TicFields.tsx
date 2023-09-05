import { TicMarbleSlot } from "@/components/Tic/TicMarbleSlot";
import { FunctionComponent, h, JSX } from "preact";

type Props = {

};

export function TicFields({ }: Props) {
  return <div className="tic-fields">
    {
      (() => {
        const fields: JSX.Element[] = [];

        for (let i = 0; i < 60; i++) {
          fields.push(<TicMarbleSlot index={i} key={i}></TicMarbleSlot>);
        }

        return fields;
      })()
    }
  </div>;
}