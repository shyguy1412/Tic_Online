import { ServerSideProps } from '@/pages/index.props';
import { h, Fragment } from 'preact';
import { Document } from '@/components/Document';
import { Head } from '@/components/Head';

const { API_PREFIX } = process.env;

export default function App({ }: ServerSideProps) {

  return <>
    <Document>
      <Head>
        <title>Tic Online</title>
      </Head>
      <form action={`${API_PREFIX}/room`} method="POST">
        <input name="username" required={true} type="text" />
        <button>Create new room</button>
      </form>
    </Document>
  </>;

}