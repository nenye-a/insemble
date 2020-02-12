import React, { ComponentProps, forwardRef, Ref, CSSProperties } from 'react';
import styled, { css } from 'styled-components';

import Label from './Label';
import View from './View';
import Text from './Text';
import {
  FONT_FAMILY_NORMAL,
  FONT_SIZE_NORMAL,
  DEFAULT_BORDER_RADIUS,
  FONT_SIZE_SMALL,
} from '../constants/theme';
import {
  TEXT_INPUT_BORDER_COLOR,
  TEXT_COLOR,
  DISABLED_TEXT_INPUT_BACKGROUND,
  RED_TEXT,
} from '../constants/colors';
import useID from '../utils/useID';

type InputProps = ComponentProps<'input'>;
type TextInputProps = Omit<InputProps, 'onSubmit'> & {
  onSubmit?: () => void;
  containerStyle?: CSSProperties;
};

type Props = TextInputProps & {
  label?: string;
  errorMessage?: string;
};

export default forwardRef((props: Props, forwardedRef: Ref<HTMLInputElement>) => {
  let {
    id: providedID,
    label,
    onSubmit,
    ref,
    disabled,
    containerStyle,
    errorMessage,
    ...otherProps
  } = props;
  let fallbackID = useID();

  let id = providedID || fallbackID;
  return (
    <Container flex style={containerStyle}>
      {label && <LabelWrapper id={id} text={label} />}
      <InputBox
        id={id}
        type="text"
        ref={forwardedRef}
        onKeyPress={(event) => {
          if (event.which === 13 && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
            onSubmit && onSubmit();
          }
        }}
        disabled={disabled}
        {...otherProps}
      />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Container>
  );
});

const Container = styled(View)`
  height: 76px;
`;
const LabelWrapper = styled(Label)`
  padding-bottom: 8px;
`;

const InputBox = styled.input`
  padding: 8px 12px;
  height: 36px;
  color: ${TEXT_COLOR};
  border: solid 1px ${TEXT_INPUT_BORDER_COLOR};
  border-radius: ${DEFAULT_BORDER_RADIUS};
  display: block;
  width: 100%;
  box-sizing: border-box;
  font-family: ${FONT_FAMILY_NORMAL};
  font-size: ${FONT_SIZE_NORMAL};
  ${(props) =>
    props.disabled &&
    css`
      background-color: ${DISABLED_TEXT_INPUT_BACKGROUND};
    `}
`;

const ErrorMessage = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  color: ${RED_TEXT};
  margin-top: 8px;
`;
