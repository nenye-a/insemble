import React, { ReactNode, DetailedHTMLProps, FormHTMLAttributes } from 'react';

type Props = ViewProps &
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    children: ReactNode;
  };

export default function Form(props: Props) {
  let { children, ...otherProps } = props;
  return <form {...otherProps}>{children}</form>;
}
