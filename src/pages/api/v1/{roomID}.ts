import type { Request, Response } from 'express';
import { createServerSentEventStream, useCookies } from 'squid-ssr/hooks';
import { getUserHand, Room } from '@/lib/models/Room';
import { connectToDatabase } from '@/lib/mongoose';
import { TicEventManager } from '@/lib/tic/TicEventManager';

const methods = {
  GET: (req: Request, res: Response) => _get(req, res),
  HEAD: (req: Request, res: Response) => _head(req, res),
  POST: (req: Request, res: Response) => _post(req, res),
  PUT: (req: Request, res: Response) => _put(req, res),
  DELETE: (req: Request, res: Response) => _delete(req, res),
  UPDATE: (req: Request, res: Response) => _update(req, res),
  OPTIONS: (req: Request, res: Response) => _options(req, res),
  TRACE: (req: Request, res: Response) => _trace(req, res),
};


export default async function handler(req: Request, res: Response) {
  connectToDatabase();
  const method = req.method ?? 'GET';
  if (Object.hasOwn(methods, method))
    await methods[method as keyof typeof methods](req, res);
}

async function _get(req: Request, res: Response) {
  const { roomID } = req.params;
  const sseStream = createServerSentEventStream(req, res);

  const cookies = useCookies(req, res);

  const { userID } = cookies['tic_room'];

  const listener = async () => {
    const room = await Room.findOne({ roomID });
    if (!room) return sseStream.close();
    sseStream.send('board', room.state.board);
    sseStream.send('hand', getUserHand(userID, room));
  };

  TicEventManager.addListener(`update_room_${roomID}`, listener);

  sseStream.addEventListener('close', () => TicEventManager.removeListener(`update_room_${roomID}`, listener));
}

async function _post(req: Request, res: Response) {
  res.status(400).send('Method does not exist for this route');
}

async function _put(req: Request, res: Response) {
  res.status(400).send('Method does not exist for this route');
}

async function _delete(req: Request, res: Response) {
  res.status(400).send('Method does not exist for this route');
}

async function _head(req: Request, res: Response<any>) {
  res.status(400).send('Method does not exist for this route');
}
async function _update(req: Request, res: Response<any>) {
  res.status(400).send('Method does not exist for this route');
}

async function _trace(req: Request, res: Response<any>) {
  res.status(400).send('Method does not exist for this route');
}

async function _options(req: Request, res: Response) {
  res.status(400).send('Method does not exist for this route');
}
