import { h, Fragment, ComponentChildren } from 'preact';

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
      </head>
      <body>
        {children}
      </body>
    </html>
  </>
}