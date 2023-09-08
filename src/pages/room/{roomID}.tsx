import type { ServerSideProps } from '@/pages/room/{roomID}.props';
import { h, Fragment } from 'preact';
import { Document } from '@/components/Document';
import { Head } from '@/components/Head';
import { TicGame } from '@/components/Tic/TicGame';

import '@/style/roomID.css';
import '@/style/fullscreen.css';

export default function App({ state }: ServerSideProps) {


  // const sse = useServerSentEvents('/api/v0/room/sse');

  // sse.addEventListener('test', ({ detail: data }) => {
  //   console.log(data);

  // });

  console.log(state);

  return <>
    <Document>
      <Head>
        <title>Tic Online</title>
      </Head>

      <TicGame state={state} ></TicGame>

    </Document>
  </>;

}
