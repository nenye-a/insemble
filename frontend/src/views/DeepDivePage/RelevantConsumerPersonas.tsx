import React from 'react';
import styled from 'styled-components';

import { View, Card } from '../../core-ui';
import RelevantConsumerCard from './RelevantConsumerCard';
import { LocationDetails_locationDetails_result_topPersonas as locationPersonas } from '../../generated/LocationDetails';

type Props = {
  personasData?: Array<locationPersonas>;
};

export default function RelevantConsumerPersonas(props: Props) {
  let { personasData } = props;
  return (
    <Container titleBackground="white" title="Relevant Consumer Personas">
      <CardsContainer>
        {personasData &&
          personasData.map((item, index) => <RelevantConsumerCard key={index} {...item} />)}
      </CardsContainer>
    </Container>
  );
}

const Container = styled(Card)`
  margin: 18px 36px;
`;

const CardsContainer = styled(View)`
  padding: 30px 42px;
  flex-direction: row;
`;
