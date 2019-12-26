import React, { ReactNode } from 'react';
import styled from 'styled-components';

const BackgroundContainer = styled.div`
  background-image: url('https://insemble-photos.s3.us-east-2.amazonaws.com/interactive-landing-background.jpg');
  background-size: cover;
  background-position-x: center;
  background-position-y: center;
  background-repeat: no-repeat;
`;

const ContentContainer = styled.div`
  background-color: rgba(32, 32, 32, 0.7);
  min-height: 100vh;
  padding-top: 72px;
`;

const Content = styled.div`
  max-width: 740px;
  margin: 0 auto;
`;

type Props = {
  children: ReactNode;
};

export default (props: Props) => {
  return (
    <BackgroundContainer>
      <ContentContainer>
        <Content>{props.children}</Content>
      </ContentContainer>
    </BackgroundContainer>
  );
};
