import styled from 'styled-components';
import View from './View';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';

const Card = styled(View)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export default Card;
