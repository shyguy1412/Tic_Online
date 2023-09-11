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

const {
  API_PREFIX
} = config;

export default function App({ board: initialBoard, hand: initialHand, roomID, state: initialState, playability }: ServerSideProps) {

  const [board, setBoard] = useState(initialBoard);
  const [hand, setHand] = useState(initialHand);
  const [state, setState] = useState(initialState);

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

  console.log(playability);

  return <>
    <Document>
      <Head>
        <title>Tic Online</title>
      </Head>

      <TicGame board={board} hand={hand} state={state}></TicGame>

    </Document>
  </>;

}
