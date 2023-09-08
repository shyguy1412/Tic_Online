import { Room } from '@/lib/models/Room';
import { Request } from 'express';

export default async function getServerSideProps(req: Request) {
  try {

  const room = await Room.findOne({
    roomID: req.params.roomID
  });


    return {
      props: {
        state: room?.state.board,
      }
    };

  } catch (_) {
    console.log(_);

    return {
      props: {}
    };
  }

}

export type ServerSideProps = Awaited<ReturnType<typeof getServerSideProps>>['props'];