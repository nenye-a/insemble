import styled from 'styled-components';

const Button = styled('button')`
  color: #fff;
  border-color: #634fa2;
  background-color: #634fa2;
  box-shadow: none;
  border-radius: 4px;
  height: 36px;
  /* TODO: font-family */
  font-size: 14px;
  padding-left: 12px;
  padding-right: 12px;
  &:hover {
    opacity: 0.9;
  }
`;

export default Button;
