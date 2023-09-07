import type { Request, Response } from 'express';
import { useCookies } from 'squid-ssr/hooks';
import crypto from 'crypto';
import { Room } from '@/lib/models/Room';
import { v4 } from 'uuid';

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
  console.log(req.body);

  if (!req.body.username || typeof req.body.username != 'string') {
    return res.status(400).send('Bad Request');
  }

  const cookies = useCookies(req, res);

  const roomID = crypto
    .createHash('md5')
    .update(Date.now() + '')
    .digest()
    .toString('hex');

  const userID = v4();

  const newRoom = await Room.create({
    roomID,
    users: [{
      name: req.body.username,
      id: userID
    }]
  });

  newRoom.save();

  cookies.add({
    key: 'tic_room',
    value: {
      name: req.body.username,
      id: userID,
      room: roomID
    },
    path: '/'
  });

  res.redirect(`/room/${roomID}`);
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
