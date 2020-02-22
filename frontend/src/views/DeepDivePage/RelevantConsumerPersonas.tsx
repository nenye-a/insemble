import React, { useContext } from 'react';
import styled from 'styled-components';

import { View, Card } from '../../core-ui';
import RelevantConsumerCard from './RelevantConsumerCard';
import { DeepDiveContext } from './DeepDiveModal';

export default function RelevantConsumerPersonas() {
  let data = useContext(DeepDiveContext);
  let personasData = data?.result.topPersonas;
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
