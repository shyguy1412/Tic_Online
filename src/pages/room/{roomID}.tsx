import { h, Fragment } from 'preact';
import { Document } from '@/components/Document';
import { Head } from '@/components/Head';
import { Request } from 'express';
import { TicBoard } from '@/components/Tic/TicBoard';
import { useServerSentEvents } from 'squid-ssr/hooks';

import '@/style/roomID.css';
import '@/style/fullscreen.css';

export function getServerSideProps(req: Request) {
  return {
    props: {
      name: req.params.roomID,
    }
  };
}

type Props = {

} & ReturnType<typeof getServerSideProps>['props'];

export default function App({ name }: Props) {

  // const sse = useServerSentEvents('/api/v0/room/sse');

  // sse.addEventListener('test', ({ detail: data }) => {
  //   console.log(data);

  // });

  return <>
    <Document>
      <Head>
        <title>Tic Online</title>
      </Head>

      <div className="game-wrapper">
        <TicBoard
          state={{
            homes:
              [[{
                id: '1',
                color: '#ff0000',
                owner: 'player1',
              }]],
            field: [],
            currentPlayer: 'player1'
          }}
        ></TicBoard>
      </div>

    </Document>
  </>;

}
