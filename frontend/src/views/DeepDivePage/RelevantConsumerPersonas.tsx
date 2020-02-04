import React from 'react';
import styled from 'styled-components';

import { View, Card } from '../../core-ui';
import RelevantConsumerCard from './RelevantConsumerCard';
import { CONSUMER_PERSONAS } from '../../fixtures/dummyData';

export default function RelevantConsumerPersonas() {
  return (
    <Container titleBackground="white" title="Relevant Consumer Personas">
      <CardsContainer>
        {CONSUMER_PERSONAS.map((item, index) => (
          <RelevantConsumerCard key={index} {...item} />
        ))}
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
