import { ComponentChildren, JSX } from "preact";
import { h } from "preact";
import { createPortal } from "preact/compat";
import { useRef, useEffect } from "preact/hooks";

type Props = {
  open?: boolean;
  children?: ComponentChildren;
  onOpen?: () => void;
  onClose?: () => void;
} & JSX.HTMLAttributes;

export function Modal({ open, children, onOpen, onClose, ...attributes }: Props) {
  if (!('document' in globalThis)) return null;
  
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (open) {
      if (ref.current.open) return;
      ref.current.showModal();
      if (onOpen) onOpen();
    }

    else if (!open) {
      if (!ref.current.open) return;
      ref.current.close();
    }

  }, [open, ref]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.addEventListener('close', () => {
      if (onClose) onClose();
    });
  }, [ref]);

  return createPortal(<dialog {...attributes} ref={ref}
  >
    {children}
  </dialog>, document.body);
}