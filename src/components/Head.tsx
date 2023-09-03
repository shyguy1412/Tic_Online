/* @jsx h */
import { h, Fragment, ComponentChildren } from 'preact';
import { createPortal } from 'preact/compat';

type Props = {
  children?: ComponentChildren;
};

export function Head({ children }: Props) {
  if (!('document' in globalThis)) return null;
  return createPortal(<>{children}</>, document.head);
}