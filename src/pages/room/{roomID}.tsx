import { h, Fragment } from 'preact';
import { Document } from '@/components/Document';
import { Head } from '@/components/Head';
import { Request } from 'express';

import '@/style/roomID.css';
import '@/style/fullscreen.css';
import { TicGame } from '@/components/Tic/TicGame';

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

      <TicGame></TicGame>

    </Document>
  </>;

}
