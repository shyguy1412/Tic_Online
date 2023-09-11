import { Request, Response } from 'express';
import { useCookies } from 'squid-ssr/hooks';

export default async function getServerSideProps(req: Request, res: Response) {

  const cookies = useCookies(req, res);

  cookies.remove('tic_room');

  return {
    props: {},
    redirect: '/'
  };
}

export type ServerSideProps = Awaited<ReturnType<typeof getServerSideProps>>['props'];