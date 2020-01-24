import React, { ComponentProps, forwardRef, Ref } from 'react';
import styled from 'styled-components';

import Text from './Text';
import {
  FONT_SIZE_SMALL,
  FONT_FAMILY_NORMAL,
  FONT_SIZE_NORMAL,
  DEFAULT_BORDER_RADIUS,
} from '../constants/theme';
import { TEXT_INPUT_BORDER_COLOR, TEXT_COLOR, THEME_COLOR } from '../constants/colors';

type InputProps = ComponentProps<'input'>;
type TextInputProps = Omit<InputProps, 'onSubmit'> & {
  onSubmit?: () => void;
};

type Props = TextInputProps & {
  buttonText?: string;
  icon?: boolean;
  label?: string;
};

export default forwardRef((props: Props, forwardedRef: Ref<HTMLInputElement>) => {
  let { id, label, onSubmit, ref, icon, ...otherProps } = props;
  return (
    <>
      {label && (
        <Label as="label" htmlFor={id} fontSize={FONT_SIZE_SMALL} color={THEME_COLOR}>
          {label}
        </Label>
      )}
      <InputBox
        id={id}
        type="text"
        ref={forwardedRef}
        onKeyPress={(event) => {
          if (event.which === 13 && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
            onSubmit && onSubmit();
          }
        }}
        {...otherProps}
      />
    </>
  );
});

const Label = styled(Text)`
  margin-bottom: 8px;
`;

const InputBox = styled.input`
  padding: 8px 12px;
  height: 36px;
  color: ${TEXT_COLOR};
  border: solid 0.5px ${TEXT_INPUT_BORDER_COLOR};
  border-radius: ${DEFAULT_BORDER_RADIUS};
  display: block;
  width: 100%;
  box-sizing: border-box;
  font-family: ${FONT_FAMILY_NORMAL};
  font-size: ${FONT_SIZE_NORMAL};
`;
