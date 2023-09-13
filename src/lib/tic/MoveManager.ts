import { IRoom } from "@/lib/models/Room";
import { TicCard } from "@/lib/tic/types/TicCard";
import { TicMarble } from "@/lib/tic/types/TicMarble";
import { Document, Model } from "mongoose";

function createPreviewMarble(marble: TicMarble, move: string, value?: number): TicMarble {
  return {
    color: "#eeeeee",
    id: `preview:${marble.id}:${move}${value ? `:${value}` : ''}`,
    player: marble.player,
    meta: {
      preview: true
    }
  };
}

const SelectMoveMap: { [key in TicCard['type']]: (marble: TicMarble, value: number, room: IRoom) => void } = {
  number: function (marble, value, room): void {
    const playerState = room.users[room.state.currentPlayer].state;
    const board = room.state.board;

    if (!board) throw new Error("No Field to play in");
    if (playerState?.type != 'play') throw new Error('Not this players turn');

    board.field
      .filter(m => playerState.validMarbles.some(vm => vm == m?.id))
      .forEach(marble => { // for each marble that can be moved
        if (!marble) throw new Error("Can not create preview of empty field");
        const pos = room.state.board?.field.indexOf(marble) ?? 0;
        board.field[(pos + value + 60) % 60] = createPreviewMarble(marble, 'move', value);
      });
  },
  split: function (marble, value, room): void {
    const state = room.users[room.state.currentPlayer].state;
    if (state.type != 'play') throw new Error('Not this players turn');
    if (!state.meta.left) throw new Error('No more moves to do');

    for (let i = 1; i <= state.meta.left; i++) {
      this.number(marble, i, room);
    }

    // throw new Error("Function not implemented.");
  },
  enter: function (marble, value, room): void {
    const entryField = marble.player * 15;
    const playerState = room.users[room.state.currentPlayer].state;
    const board = room.state.board;
    const marbleHome = room.state.board.homes[room.state.currentPlayer].some(m => m.id == marble.id);

    if (!board) throw new Error("No Field to play in");
    if (playerState?.type != 'play') throw new Error('Not this players turn');
    if (marbleHome)
      board.field[entryField] = createPreviewMarble(marble, 'enter');
    else
      this.number(marble, value, room);
    // board.field
    //   .filter(m => playerState.validMarbles.some(vm => vm == m?.id))
    //   .forEach(marble => { // for each marble that can be moved
    //     if (!marble) throw new Error("Can not create preview of empty field");
    //     const pos = room.state.board?.field.indexOf(marble) ?? 0;
    //     board.field[(pos + value + 60) % 60] = createPreviewMarble(marble, 'move', value);
    //   });
  },
  backwards: function (marble, value, room): void {
    return SelectMoveMap['number'](marble, value * -1, room);
  },
  skip: function (marble, value, room): void {
    this.number(marble, value, room);
  },
  first_aid: function (marble, value, room): void {
    throw new Error("Function not implemented.");
  },
  mindcontrol: function (marble, value, room): void {
    throw new Error("Function not implemented.");
  },
  dash_attack: function (marble, value, room): void {
    throw new Error("Function not implemented.");
  },
  rotate: function (marble, value, room): void {
    throw new Error("Function not implemented.");
  },
  swap: function (marble, value, room): void {
    throw new Error("Function not implemented.");
  },
  undo: function (marble, value, room): void {
    throw new Error("Function not implemented.");
  }
};

export function selectMove(marble: TicMarble, room: IRoom): IRoom['state']['board'] {
  const center = room.state.board.center;
  if (!center) throw new Error("No Card has been played");
  SelectMoveMap[center.type](marble, center.value ?? -1, room);
  return room.state.board;
}