import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { Document } from '@/components/Document';
import { Head } from '@/components/Head';

export function getServerSideProps() {
  return {
    props: {
      name: 'World'
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
        <title> MAIN</title>
      </Head>
      <div>Hello {name} {count}</div>
      <button onClick={() => setCount(count + 1)}>Count</button>
    </Document>
  </>;

}
