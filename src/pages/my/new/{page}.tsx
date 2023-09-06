import type { Request, Response } from 'express';
import { h } from 'preact';
import { Document } from '@/components/Document';
import { Head } from '@/components/Head';

export function getServerSideProps(req: Request, res: Response) {

  return {
    props: {}
  };
}

type Props = {

} & ReturnType<typeof getServerSideProps>['props'];

export default function App({ }: Props) {

  return <Document>
    <Head>
      <title>New Page</title>
    </Head>

    Hello World!

  </Document>;

}