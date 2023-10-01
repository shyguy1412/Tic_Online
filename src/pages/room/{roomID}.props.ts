import { getUserHand, getUserPlayer, getUserState, Room } from '@/lib/models/Room';
import { getPlayability } from '@/lib/tic/GameLogic';
import { Request, Response } from 'express';
import { useCookies } from 'squid-ssr/hooks';

export default async function getServerSideProps(req: Request, res: Response) {
  try {

    const room = await Room.findOne({
      roomID: req.params.roomID
    });

    if (!room) throw new Error("Expired Room");

    const cookies = useCookies(req, res);

    const { userID } = cookies['tic_room'];

    const hand = getUserHand(userID, room);
    const state = getUserState(userID, room);
    const playability = getPlayability(userID, room);
    const player = getUserPlayer(userID, room);
    const currentPlayer = room.state.currentPlayer;

    return {
      props: {
        board: room.state.board,
        state,
        hand,
        playability,
        player,
        currentPlayer,
        roomID: req.params.roomID
      }
    };

  } catch (_) {
    return {
      // props: {
      //   roomID: req.params.roomID
      // }
      redirect: '/reset'
    };
  }

}

export type ServerSideProps = NonNullable<Awaited<ReturnType<typeof getServerSideProps>>['props']>;