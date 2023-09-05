import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { Document } from '@/components/Document';
import { Head } from '@/components/Head';
import { useCookies } from 'squid-ssr/hooks';
import { Request, Response } from 'express';

export function getServerSideProps(req: Request, res: Response) {

  const cookies = useCookies(req, res);

  return {
    props: {},
    redirect: cookies['tic_room'] ? `/room/${cookies['tic_room'].room}` : undefined
  };
}

type Props = {

} & ReturnType<typeof getServerSideProps>['props'];

export default function App({ }: Props) {

return <>
    <Document>
      <Head>
        <title>Tic Online</title>
      </Head>
      <form action="/api/v0/room" method="POST">
        <input name="username" required={true} type="text" />
        <button>Create new room</button>
      </form>
    </Document>
  </>;

}