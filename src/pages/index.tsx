import { ServerSideProps } from '@/pages/index.props';
import { h, Fragment } from 'preact';
import { Document } from '@/components/Document';
import { Head } from '@/components/Head';
import config from '@/config';

const { API_PREFIX } = config;

export default function App({ }: ServerSideProps) {

  return <>
    <Document>
      <Head>
        <title>Tic Online</title>
      </Head>
      <form action={`${API_PREFIX}/room`} method="POST">
        <input name="username" required={true} type="text" value={"Nils"} />
        <button>Create new room</button>
      </form>
    </Document>
  </>;

}