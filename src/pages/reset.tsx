import type {ServerSideProps} from '@/pages/reset.props'
import { h } from 'preact';
import { Document } from '@/components/Document';
import { Head } from '@/components/Head';

export default function App({ }: ServerSideProps) {

  return <Document>
    <Head>
      <title>New Page</title>
    </Head>

    Hello World!

  </Document>;

}