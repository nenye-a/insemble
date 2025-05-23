import React, { ComponentProps, forwardRef, Ref } from 'react';
import styled, { css, CSSProperties } from 'styled-components';
import Label from './Label';
import View from './View';
import {
  TEXT_COLOR,
  TEXT_INPUT_BORDER_COLOR,
  DISABLED_TEXT_INPUT_BACKGROUND,
  MUTED_TEXT_COLOR,
  RED_TEXT,
} from '../constants/colors';
import { DEFAULT_BORDER_RADIUS, FONT_FAMILY_NORMAL, FONT_SIZE_NORMAL } from '../constants/theme';
import { useID } from '../utils';

type Props = ComponentProps<'textarea'> & {
  label?: string;
  characterLimit?: number;
  showCharacterLimit?: boolean;
  values?: string;
  containerStyle?: CSSProperties;
};

export default forwardRef((props: Props, forwardedRef: Ref<HTMLTextAreaElement>) => {
  let {
    id: providedID,
    values,
    defaultValue,
    label,
    characterLimit = 500,
    showCharacterLimit,
    required,
    containerStyle,
    ...otherProps
  } = props;
  let remainingCharacters =
    characterLimit - (values?.length || defaultValue?.toString().length || 0);
  let generatedID = useID();
  let id = providedID || generatedID;
  return (
    <View style={containerStyle}>
      <RowedView>
        <Row>
          {label ? <Label text={label} id={id} /> : <View />}
          {required && <Label text="*required" color={RED_TEXT} style={{ marginLeft: 8 }} />}
        </Row>
        {showCharacterLimit && (
          <RemainingCharacters text={`${remainingCharacters} characters left`} />
        )}
      </RowedView>
      <TextAreaBox
        {...otherProps}
        id={id}
        defaultValue={defaultValue}
        ref={forwardedRef}
        maxLength={characterLimit}
        value={values}
      />
    </View>
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

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
`;
