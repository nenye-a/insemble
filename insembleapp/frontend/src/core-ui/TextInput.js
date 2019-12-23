import React from 'react';
import { FormInput } from 'shards-react';

export default function TextInput({
  id,
  value,
  label,
  onChange,
  placeholder,
  showEditButton,
  ...otherProps
}) {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <FormInput
        id={id}
        placeholder={placeholder}
        onChange={() => {}}
        value={value}
        {...otherProps}
      />
    </>
  );
}
