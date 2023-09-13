import { GameManagerContext } from "@/components/Tic/TicGame";
import { TicMarble } from "@/lib/tic/types/TicMarble";
import { h } from "preact";
import { useContext } from "preact/hooks";

type Props = {
  marble: TicMarble | null;
  index?: number;
};

export function TicMarbleSlot({ marble, index }: Props) {

  const [GameState, gameManagerAction] = useContext(GameManagerContext);

  const selectable = GameState?.state?.type == 'play' ? GameState.state.validMarbles.some(m => m == marble?.id) : false;

  return <div
    onClick={() => {
      if (!gameManagerAction) return;
      if (selectable)
        return gameManagerAction({
          action: 'select-marble',
          data: marble!
        });

      if (marble?.meta?.preview)
        return gameManagerAction({
          action: 'play-marble',
          data: marble
        });
    }}
    className={`tic-marble-slot ${selectable ? 'tic-marble-selectable' : ''}`} style={{
      backgroundColor: marble?.color,
      '--marble-index': index
    }}>
  </div>;
}