import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useApolloClient } from '@apollo/react-hooks';

import { THEME_COLOR, WHITE, HIGHLIGHTED_BANNER_BACKGROUND } from '../../constants/colors';
import { View, Text } from '../../core-ui';

type Props = {
  error: boolean;
};

export default function FreeTrialBanner({ error }: Props) {
  let apolloClient = useApolloClient();
  let [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (error) {
      setHighlight(true);
      setTimeout(() => {
        setHighlight(false);
        apolloClient.writeData({
          data: {
            errorState: {
              __typename: 'ErrorState',
              locationPreview: false,
            },
          },
        });
      }, 2000);
    }
  }, [error, apolloClient]);

  return (
    <Container highlight={highlight}>
      <Text color={WHITE}>Free Trial - (only available for Los Angeles)</Text>
    </Container>
  );
}

type ContainerProps = ViewProps & {
  highlight: boolean;
};

const Container = styled(View)<ContainerProps>`
  height: 30px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.highlight ? HIGHLIGHTED_BANNER_BACKGROUND : THEME_COLOR)};
`;
