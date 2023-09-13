import type { Request, Response } from 'express';
import { createServerSentEventStream, useCookies } from 'squid-ssr/hooks';
import { getUserHand, getUserState, Room } from '@/lib/models/Room';
import { connectToDatabase } from '@/lib/mongoose';
import { TicEventManager } from '@/lib/tic/TicEventManager';
import { getPlayability } from '@/lib/tic/GameLogic';

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
  const cookies = useCookies(req, res);
  if (!cookies['tic_room']) return res.status(401).send('Expired Session');
  const { userID } = cookies['tic_room'];

  const sseStream = createServerSentEventStream(req, res);

  const getRoom = async () => {
    const room = await Room.findOne({ roomID });
    if (!room) throw new Error('Invalid Room');
    return room;
  };

  const sendState = async () => sseStream.send('state', getUserState(userID, (await getRoom())));
  const sendBoard = async () => sseStream.send('board', (await getRoom()).state.board);
  const sendHand = async () => sseStream.send('hand', getUserHand(userID, (await getRoom())));
  const sendPlayability = async () => sseStream.send('playability', getPlayability(userID, (await getRoom())));

  TicEventManager.addListener(`${roomID}:board`, sendBoard);
  TicEventManager.addListener(`${roomID}:${userID}:hand`, sendHand);
  TicEventManager.addListener(`${roomID}:${userID}:state`, sendState);
  TicEventManager.addListener(`${roomID}:${userID}:playability`, sendPlayability);

  sseStream.addEventListener('close', () => {
    TicEventManager.removeListener(`${roomID}:board`, sendBoard);
    TicEventManager.removeListener(`${roomID}:${userID}:hand`, sendHand);
    TicEventManager.removeListener(`${roomID}:${userID}:state`, sendState);
    TicEventManager.removeListener(`${roomID}:${userID}:playability`, sendPlayability);
  });
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
