import React from 'react';
import styled from 'styled-components';

import { View, Card } from '../../core-ui';
import RelevantConsumerCard from './RelevantConsumerCard';
import { LocationDetails_locationDetails_result_topPersonas as LocationPersonas } from '../../generated/LocationDetails';
import BlurredPersonas from '../../assets/images/blurred-personas.png';
import { Role } from '../../types/types';

type Props = ViewProps & {
  personasData?: Array<LocationPersonas> | null;
  isLocked?: boolean;
  role?: Role;
};

export default function RelevantConsumerPersonas(props: Props) {
  let { personasData, isLocked, role, ...otherProps } = props;
  return (
    <Container
      titleBackground="white"
      title="Relevant Consumer Personas"
      isLocked={isLocked}
      {...otherProps}
    >
      {isLocked ? (
        <Image src={BlurredPersonas} />
      ) : (
        <CardsContainer role={role}>
          {personasData &&
            personasData.map((item, index) => <RelevantConsumerCard key={index} {...item} />)}
        </CardsContainer>
      )}
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

const Image = styled.img`
  width: 100%;
  object-fit: cover;
`;
