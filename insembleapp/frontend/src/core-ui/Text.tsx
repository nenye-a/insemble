import styled from 'styled-components';
import { FONT_SIZE_NORMAL, FONT_FAMILY_NORMAL } from '../constants/theme';

// TODO: Not sure if we should change this to use styled.span
let Text = styled.div`
  box-sizing: border-box;
  color: black;
  display: inline;
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  border: 0 solid black;
  border-image: initial;
  font-size: ${FONT_SIZE_NORMAL};
  font-family: ${FONT_FAMILY_NORMAL};
`;

export default Text;
