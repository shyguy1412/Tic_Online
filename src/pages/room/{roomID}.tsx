import type { ServerSideProps } from '@/pages/room/{roomID}.props';
import { h, Fragment } from 'preact';
import { Document } from '@/components/Document';
import { Head } from '@/components/Head';
import { TicGame } from '@/components/Tic/TicGame';

import '@/style/roomID.css';
import '@/style/fullscreen.css';
import { useServerSentEvents } from 'squid-ssr/hooks';
import config from '@/config';
import { useState } from 'preact/hooks';
import { createContext } from 'preact';
import { TicBoardState } from '@/lib/tic/types/TicBoardState';
import { TicCard } from '@/lib/tic/types/TicCard';
import { TicPlayerState } from '@/lib/tic/types/TicPlayerState';
import { CardPlayabilityMap, PlayabilityResult } from '@/lib/tic/types/PlayabilityResult';

import '@/i18n/i18next.config.mjs';

const {
  API_PREFIX
} = config;

export const TicGameStateContext = createContext<{
  board?: TicBoardState,
  hand?: TicCard[],
  state?: TicPlayerState,
  playability?: CardPlayabilityMap;
} | null>(null);

export default function App({
  roomID,
  board: initialBoard,
  hand: initialHand,
  state: initialState,
  playability: initialPlayability }: ServerSideProps) {

  const [board, setBoard] = useState(initialBoard);
  const [hand, setHand] = useState(initialHand);
  const [state, setState] = useState(initialState);
  const [playability, setPlayability] = useState(initialPlayability);

  const sse = useServerSentEvents(`${API_PREFIX}/${roomID}`);

  sse.addEventListener('board', ({ detail: data }) => {
    setBoard(data);
  });

  sse.addEventListener('hand', ({ detail: data }) => {
    setHand(data);
  });

  sse.addEventListener('state', ({ detail: data }) => {
    setState(data);
  });

  return <>
    <Document>
      <Head>
        <title>Tic Online</title>
      </Head>
      <TicGameStateContext.Provider value={{
        hand, state, board, playability
      }}>
        <TicGame
        ></TicGame>
      </TicGameStateContext.Provider>

    </Document>
  </>;

}
