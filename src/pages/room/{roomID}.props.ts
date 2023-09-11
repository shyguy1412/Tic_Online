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

    return {
      props: {
        board: room.state.board,
        state,
        hand,
        playability,
        roomID: req.params.roomID
      }
    };

  } catch (_) {
    console.log(_);

    return {
      props: {
        roomID: req.params.roomID
      }
    };
  }

}

export type ServerSideProps = Awaited<ReturnType<typeof getServerSideProps>>['props'];