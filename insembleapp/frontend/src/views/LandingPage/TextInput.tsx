import React, { ComponentProps, forwardRef, Ref } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY_NORMAL, FONT_SIZE_MEDIUM } from '../../constants/theme';

type ButtonProps = ComponentProps<'button'>;
type InputProps = ComponentProps<'input'>;
type TextInputProps = Omit<InputProps, 'onSubmit'> & {
  onSubmit?: () => void;
};

function Button(props: ButtonProps) {
  return <button {...props} type="button" />;
}

const TextInput = forwardRef((props: TextInputProps, forwardedRef: Ref<HTMLInputElement>) => {
  let { onSubmit, ...otherProps } = props;
  return (
    <input
      {...otherProps}
      type="text"
      ref={forwardedRef}
      onKeyPress={(event) => {
        if (event.which === 13 && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
          onSubmit && onSubmit();
        }
      }}
    />
  );
});

const InputContainer = styled.div`
  position: relative;
  font-family: ${FONT_FAMILY_NORMAL};
  font-size: ${FONT_SIZE_MEDIUM};
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
  buttonText?: string;
};

export default forwardRef((props: Props, forwardedRef: Ref<HTMLInputElement>) => {
  let { buttonText, onSubmit, ref, ...otherProps } = props;
  return (
    <InputContainer>
      <StyledTextInput {...otherProps} ref={forwardedRef} onSubmit={onSubmit} />
      {buttonText && <StyledButton onClick={onSubmit}>{buttonText}</StyledButton>}
    </InputContainer>
  );
});
