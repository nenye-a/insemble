import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { View } from '../../core-ui';

const BackgroundContainer = styled(View)`
  background-image: url('https://insemble-photos.s3.us-east-2.amazonaws.com/interactive-landing-background.jpg');
  background-size: cover;
  background-position-x: center;
  background-position-y: center;
  background-repeat: no-repeat;
`;

const ContentContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  min-height: 60vh;
  justify-content: center;
  align-items: center;
`;

const TopGradien = styled.div`
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 1) 90%);
  height: 70px;
`;
const Content = styled.div`
  max-width: 740px;
  margin: 0 auto;
  padding: 24px;
`;

type Props = {
  children: ReactNode;
};

export default (props: Props) => {
  return (
    <BackgroundContainer>
      <TopGradien />
      <ContentContainer>
        <Content>{props.children}</Content>
      </ContentContainer>
    </BackgroundContainer>
  );
};
