import { getUser, getUserHand, IRoom, Room } from '@/lib/models/Room';
import { getInitialMetaInfo, getPlayability } from '@/lib/tic/GameLogic';
import { TicEventManager } from '@/lib/tic/TicEventManager';
import { TicMarble } from '@/lib/tic/types/TicMarble';
import { TicPlayerState } from '@/lib/tic/types/TicPlayerState';
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

  const room = await Room.findOne({
    roomID
  });

  if (!room) return res.status(400).send('Expired Room');


  const user = getUser(userID, room);
  if (!user) return res.status(500).send('Internal Server Error');
  const state = user.state.type;

  if (state == 'wait') {
    return res.status(400).send("Not this players turn");
  }

  if (state == 'choose') {
    //!check if current players turn
    const hand = getUserHand(userID, room);

    const card = hand.find(c => c.id == req.body.id);
    if (!card) return res.status(400).send('Invalid Card');
    const playability = getPlayability(userID, room, card)[card.id];

    if (!playability.playable) {
      return res.status(400).send('Invalid Card');
    }

    room.state.board.center = req.body;
    room.state.hands[user.player] = hand.filter(c => c.id != req.body.id);

    user.state = {
      type: 'play',
      card: req.body,
      validMarbles: playability.marbles,
      meta: getInitialMetaInfo(req.body)
    };

    await room.save();

    TicEventManager.emit(`${roomID}:board`);
    TicEventManager.emit(`${roomID}:${userID}:hand`);
    TicEventManager.emit(`${roomID}:${userID}:state`);

    return res.status(201).send();
  }

  if (state == 'play') {
    const marble: TicMarble = req.body;

    const card = user.state.card;
    if (!card) return res.status(400).send("No Card Played");
    const playability = getPlayability(userID, room, card)[card.id];
    const [, marbleID, move, value] = marble.id.split(':');

    if (!playability.playable) return res.status(400).send('Card not Playable');
    if (!playability.marbles.some(m => m == marbleID)) return res.status(400).send('Marble not Playable');

    //! Double check if move is actually valid

    room.state.undoBuffer = JSON.parse(JSON.stringify(room.state.board));

    if (move == 'enter') {
      const entryPoint = marble.player * 15;
      const targetMarble = room.state.board.homes[marble.player].find(m => m.id == marbleID) ?? null;
      if (!targetMarble) return res.status(400).send('Marble not Playable');
      room.state.board.field[entryPoint] = targetMarble;
      room.state.board.homes[marble.player] = room.state.board.homes[marble.player].filter(m => m.id != marbleID);

      //! increment current player

      user.state = {
        type: 'choose',
      };

      await room.save();
      TicEventManager.emit(`${roomID}:board`);
      TicEventManager.emit(`${roomID}:${userID}:state`);
      TicEventManager.emit(`${roomID}:${userID}:playability`);
      return res.status(201).send();
    }

    if (move == 'move') {
      const targetMarble = room.state.board.field.find(m => m?.id == marbleID) ?? null;
      if (!targetMarble) return res.status(400).send('Marble not Playable');
      const pos = room.state.board.field.indexOf(targetMarble);
      room.state.board.field[pos] = null;
      room.state.board.field[(pos + Number(value) + 60) % 60] = targetMarble;

      if (card.type == 'split') {
        user.state.meta = {
          left: (user.state.meta.left ?? 0) - Number(value)
        };

        if (user.state.meta.left <= 0) {
          user.state = {
            type: 'choose',
          };
        }
      } else {
        user.state = {
          type: 'choose',
        };
      }

      await room.save();
      TicEventManager.emit(`${roomID}:board`);
      TicEventManager.emit(`${roomID}:${userID}:state`);
      TicEventManager.emit(`${roomID}:${userID}:playability`);
      return res.status(201).send();
    }

  }

  res.status(400).send('Invalid User State');
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
