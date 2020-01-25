import React, { useEffect, useRef, ReactNode } from 'react';

type Props = {
  onClickAway: () => void;
  children: ReactNode;
};

export default function ClickAway(props: Props) {
  let { children, onClickAway } = props;
  let node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let handler = (event: MouseEvent) => {
      if (node.current && node.current.contains(event.target as Node)) {
        return;
      }

      onClickAway();
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });

  return <div ref={node}>{children}</div>;
}
