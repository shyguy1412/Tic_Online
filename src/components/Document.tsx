import { h, Fragment, ComponentChildren } from 'preact';
import 'normalize.css';
import '@/style/global.css'

type Props = {
  children: ComponentChildren
}

export function Document({ children }: Props) {

  return <>
    <html lang="de">
      <head>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* <!-- Custom Fonts --> */}
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@600&display=swap" rel="stylesheet"/>

        <link rel="stylesheet" href="?style" />
      </head>
      <body>
        {children}
      </body>
    </html>
  </>
}