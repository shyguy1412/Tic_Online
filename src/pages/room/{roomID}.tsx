import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { Document } from '@/components/Document';
import { Head } from '@/components/Head';
import { Request } from 'express';
import { TicBoard } from '@/components/Tic/TicBoard';
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
  const [count, setCount] = useState<number>(0);

  return <>
    <Document>
      <Head>
        <title>Tic Online</title>
      </Head>

      <div className="game-wrapper">
        <TicBoard></TicBoard>
      </div>

    </Document>
  </>;

}
