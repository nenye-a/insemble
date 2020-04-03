import React from 'react';
import styled from 'styled-components';

import { View, Card } from '../../core-ui';
import RelevantConsumerCard from './RelevantConsumerCard';
import { LocationDetails_locationDetails_result_topPersonas as LocationPersonas } from '../../generated/LocationDetails';
import { useViewport } from '../../utils';
import { ViewPropsWithViewport } from '../../constants/viewports';

type Props = {
  personasData?: Array<LocationPersonas>;
};

export default function RelevantConsumerPersonas(props: Props) {
  let { personasData } = props;
  let { isDesktop } = useViewport();

  return (
    <Container titleBackground="white" title="Relevant Consumer Personas">
      <CardsContainer isDesktop={isDesktop}>
        {personasData &&
          personasData.map((item, index) => <RelevantConsumerCard key={index} {...item} />)}
      </CardsContainer>
    </Container>
  );
}

const Container = styled(Card)`
  margin: 18px 36px;
`;

const CardsContainer = styled(View)<ViewPropsWithViewport>`
  padding: 30px 42px;
  flex-direction: ${({ isDesktop }) => (isDesktop ? 'row' : 'column')};
`;
