import { Room } from '@/lib/models/Room';
import type { Request, Response } from 'express';
import { useCookies } from 'squid-ssr/hooks';

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
  const method = req.method ?? 'GET';
  if (Object.hasOwn(methods, method))
    await methods[method as keyof typeof methods](req, res);
}

async function _get(req: Request, res: Response) {
  res.status(400).send('Method does not exist for this route');
}

async function _post(req: Request, res: Response) {
  const cookies = useCookies(req, res);

  const roomCookie = cookies['tic_room'];

  if (!roomCookie || typeof roomCookie != 'object') return res.status(401).send('Unauthorized');

  const { name, roomID, userID } = roomCookie as { [key: string]: string | undefined; };

  if (!name || !roomID || !userID)
    return res.status(400).send('Bad Request');

  const room = Room.find({
    roomID
  });

  //!check if current player
  //!check if card has already been played

  try{
    
  }

  // res.status(400).send('Method does not exist for this route');
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
