import React, { ComponentProps, forwardRef, Ref } from 'react';
import styled, { css } from 'styled-components';
import Label from './Label';
import View from './View';
import {
  TEXT_COLOR,
  TEXT_INPUT_BORDER_COLOR,
  DISABLED_TEXT_INPUT_BACKGROUND,
  MUTED_TEXT_COLOR,
} from '../constants/colors';
import { DEFAULT_BORDER_RADIUS, FONT_FAMILY_NORMAL, FONT_SIZE_NORMAL } from '../constants/theme';

type Props = ComponentProps<'textarea'> & {
  label?: string;
  characterLimit?: number;
  showCharacterLimit?: boolean;
  values: string;
};

export default forwardRef((props: Props, forwardedRef: Ref<HTMLTextAreaElement>) => {
  let { id, values, label, characterLimit = 500, showCharacterLimit, ...otherProps } = props;
  let remainingCharacters = characterLimit - values.length;
  return (
    <>
      <RowedView>
        {label && <Label text={label} />}
        {showCharacterLimit && (
          <RemainingCharacters id={id} text={`${remainingCharacters} characters left`} />
        )}
      </RowedView>
      <TextAreaBox {...otherProps} id={id} ref={forwardedRef} maxLength={characterLimit}>
        {values}
      </TextAreaBox>
    </>
  );
});

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 8px;
`;

const TextAreaBox = styled.textarea`
  padding: 8px 12px;
  color: ${TEXT_COLOR};
  border: solid 1px ${TEXT_INPUT_BORDER_COLOR};
  border-radius: ${DEFAULT_BORDER_RADIUS};
  display: block;
  width: 100%;
  height: 147px;
  box-sizing: border-box;
  font-family: ${FONT_FAMILY_NORMAL};
  font-size: ${FONT_SIZE_NORMAL};
  ${(props) =>
    props.disabled &&
    css`
      background-color: ${DISABLED_TEXT_INPUT_BACKGROUND};
    `}
`;

const RemainingCharacters = styled(Label)`
  font-style: italic;
  color: ${MUTED_TEXT_COLOR};
`;
