import React, { ComponentProps } from 'react';
import styled from 'styled-components';

type ButtonProps = ComponentProps<'button'>;
type InputProps = ComponentProps<'input'>;
type TextInputProps = Omit<InputProps, 'onSubmit'> & {
  onSubmit: () => void;
};

function Button(props: ButtonProps) {
  return <button {...props} type="button" />;
}

function TextInput(props: TextInputProps) {
  let { onSubmit, ...otherProps } = props;
  return (
    <input
      {...otherProps}
      type="text"
      onKeyPress={(event) => {
        if (event.which === 13 && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
          onSubmit();
        }
      }}
    />
  );
}

const InputContainer = styled.div`
  position: relative;
  /* TODO: font-family */
  font-size: 16px;
`;

const StyledTextInput = styled(TextInput)`
  padding: 8px 16px;
  line-height: 40px;
  color: #8e8e8e;
  border: none;
  border-radius: 4px;
  display: block;
  width: 100%;
  box-sizing: border-box;
`;

const StyledButton = styled(Button)`
  color: white;
  box-sizing: border-box;
  padding: 0 20px;
  line-height: 40px;
  border: none;
  border-radius: 3px;
  background-color: #634fa2;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 8px;
  right: 8px;
`;

type Props = TextInputProps & {
  buttonText: string;
};

export default (props: Props) => {
  let { buttonText, onSubmit, ref, ...otherProps } = props;
  return (
    <InputContainer>
      <StyledTextInput {...otherProps} onSubmit={onSubmit} />
      <StyledButton onClick={onSubmit}>{buttonText}</StyledButton>
    </InputContainer>
  );
};
