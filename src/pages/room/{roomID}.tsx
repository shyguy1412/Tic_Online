import 'preact/debug';

import type { ServerSideProps } from '@/pages/room/{roomID}.props';
import { h, Fragment } from 'preact';
import { Document } from '@/components/Document';
import { Head } from '@/components/Head';
import { TicGame } from '@/components/Tic/TicGame';

import '@/style/roomID.css';
import '@/style/fullscreen.css';

import '@/i18n/i18next.config.mjs';

export default function App({ roomID, board, hand, state, playability, player, currentPlayer }: ServerSideProps) {
  return <>
    <Document>
      <Head>
        <title>Tic Online</title>
      </Head>

      <a style={{
        position: 'absolute',
        left: '50%',
        transform: 'translate(-50%)'
      }} href="/reset">
        <h1>RESET</h1>
      </a>

      <TicGame
        board={board}
        hand={hand}
        state={state}
        playability={playability}
        roomID={roomID}
        player={player}
        currentPlayer={currentPlayer}
      ></TicGame>

    </Document>
  </>;

}
