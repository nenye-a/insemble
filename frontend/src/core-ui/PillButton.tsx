import { ComponentProps } from 'react';
import styled, { css } from 'styled-components';
import { TEXT_COLOR, THEME_COLOR, WHITE } from '../constants/colors';
import { FONT_FAMILY_NORMAL, FONT_SIZE_NORMAL } from '../constants/theme';

type PillButtonProps = ComponentProps<'button'> & {
  primary?: boolean;
};

const PillButton = styled.button.attrs(() => ({ type: 'button' }))<PillButtonProps>`
  flex: 0 1 auto;
  padding: 0.5rem 0.5rem;
  line-height: 1;

  text-align: center;
  font-size: ${FONT_SIZE_NORMAL};

  /* So the size doesn't slightly change when purple border shows up when highlighted */
  border: 1px solid;
  border-color: ${WHITE};

  border-radius: 0.375rem;
  box-shadow: 0 0 0.35rem rgba(0, 0, 0, 0.15);

  background: ${WHITE};
  color: ${TEXT_COLOR};
  font-family: ${FONT_FAMILY_NORMAL};

  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:hover {
    color: ${THEME_COLOR};
    border-color: ${THEME_COLOR};
    box-shadow: 0 0.25rem 0.35rem rgba(0, 0, 0, 0.15);
  }

  ${(props: PillButtonProps) =>
    props.primary &&
    css`
      background: ${THEME_COLOR};
      color: ${WHITE};
      border-color: ${THEME_COLOR};

      &:hover {
        color: ${WHITE};
        box-shadow: 0 0.25rem 0.45rem rgba(0, 0, 0, 0.35);
      }
    `}
`;

export default PillButton;
