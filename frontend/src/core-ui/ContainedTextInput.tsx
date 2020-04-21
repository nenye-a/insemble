import React, { ComponentProps, forwardRef, Ref } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY_NORMAL, FONT_SIZE_MEDIUM } from '../constants/theme';
import SvgSearch from '../components/icons/search';
import TouchableOpacity from './TouchableOpacity';
import Button from './Button';

type InputProps = ComponentProps<'input'>;
type TextInputProps = Omit<InputProps, 'onSubmit'> & {
  onSubmit?: () => void;
};

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
  flex-direction: row;
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
  position: absolute;
  top: 8px;
  right: 8px;
`;

type Props = TextInputProps & {
  buttonText?: string;
  buttonProps?: ComponentProps<typeof Button>;
  icon?: boolean;
};

export default forwardRef((props: Props, forwardedRef: Ref<HTMLInputElement>) => {
  let { buttonText, onSubmit, ref, icon, buttonProps, ...otherProps } = props;
  return (
    <InputContainer>
      <StyledTextInput {...otherProps} ref={forwardedRef} onSubmit={onSubmit} />
      {buttonProps && <StyledButton {...buttonProps} onPress={onSubmit} />}
      {icon && (
        <TouchableOpacity onPress={onSubmit} style={{ position: 'absolute', right: 5, top: 7 }}>
          <SvgSearch />
        </TouchableOpacity>
      )}
    </InputContainer>
  );
});
