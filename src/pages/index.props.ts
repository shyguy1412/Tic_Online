import { Request, Response } from 'express';
import { useCookies } from 'squid-ssr/hooks';

export default function getServerSideProps(req: Request, res: Response) {

  const cookies = useCookies(req, res);

  console.log(cookies);
  

  return {
    props: {},
    redirect: cookies['tic_room'] ? `/room/${cookies['tic_room'].roomID}` : undefined
  };
}

export type ServerSideProps = Awaited<ReturnType<typeof getServerSideProps>>['props'];