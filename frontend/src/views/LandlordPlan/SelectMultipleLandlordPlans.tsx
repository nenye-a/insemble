<DataTable.Cell>
  <RadioGroup options={['Basic', 'Pro']} onSelect={() => {}} align="right" />
</DataTable.Cell>;
import React, { useState } from 'react';
import styled from 'styled-components';

import { View, Button, Text as BaseText, RadioGroup } from '../../core-ui';
import { DataTable } from '../../components';
import CardFooter from '../../components/layout/OnboardingFooter';
import TierSubscriptionCard from '../Billing/TierSubscriptionCard';
import {
  FONT_WEIGHT_LIGHT,
  FONT_SIZE_SMALL,
  FONT_SIZE_LARGE,
  DEFAULT_BORDER_RADIUS,
} from '../../constants/theme';
import { SUPPORT_EMAIL } from '../../constants/app';
import { LandlordTier } from '../../constants/SubscriptionTiers';
import { DARK_TEXT_COLOR } from '../../constants/colors';

export default function SelectMultipleLandlordPlans() {
  let billingList = [
    {
      address: '317 2nd Street, LA 317 2nd CA, USA',
      spaceNumber: 1,
      tier: LandlordTier.BASIC,
      term: 1,
      photo: 'https://cdn.pixabay.com/photo/2018/08/10/21/52/restaurant-3597677_1280.jpg',
    },
    {
      address: '317 2nd Street, LA',
      spaceNumber: 2,
      tier: LandlordTier.PROFESSIONAL,
      term: 2,
      photo: 'https://cdn.pixabay.com/photo/2018/08/10/21/52/restaurant-3597677_1280.jpg',
    },
  ];

  return (
    <View>
      <Container>
        <Title>Select Plans For your Property</Title>
        <Text fontWeight={FONT_WEIGHT_LIGHT} fontSize={FONT_SIZE_SMALL}>
          Questions? Email {SUPPORT_EMAIL}
        </Text>
        <TableWrapper>
          <DataTable>
            <DataTable.HeaderRow>
              <DataTable.HeaderCell width={250} align="center">
                Property
              </DataTable.HeaderCell>
              <DataTable.HeaderCell width={50} align="center">
                Space
              </DataTable.HeaderCell>
              <DataTable.HeaderCell width={120} align="center">
                Plan
              </DataTable.HeaderCell>
              <DataTable.HeaderCell width={120} align="center">
                Term
              </DataTable.HeaderCell>
              <DataTable.HeaderCell align="right">Cost</DataTable.HeaderCell>
            </DataTable.HeaderRow>
            {billingList.map((space, index) => {
              return (
                <DataTable.Row key={index} height="60px">
                  <DataTable.Cell width={250}>
                    <Image src={space.photo} />
                    <Text>{space.address}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell width={50}>
                    <Text>{space.spaceNumber}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell width={120}>
                    <RadioGroup options={['Basic', 'Pro']} onSelect={() => {}} />
                  </DataTable.Cell>

                  <DataTable.Cell width={120}>
                    <RadioGroup options={['Monthly', 'Anually']} onSelect={() => {}} />
                  </DataTable.Cell>
                  <DataTable.Cell
                    align="right"
                    style={{ flexDirection: 'column', alignItems: 'flex-end' }}
                  >
                    <Text>$333/month</Text>
                    <Text>*paid annually</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        </TableWrapper>
      </Container>
      <CardFooter>
        <Button
          text="Next"
          onPress={() => {
            //TODO: navigate to next scene
          }}
        />
      </CardFooter>
    </View>
  );
}

const Container = styled(View)`
  padding: 24px;
  align-items: center;
`;

const Title = styled(BaseText)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_LIGHT};
`;

const TableWrapper = styled(View)`
  padding: 24px 0;
`;

const Image = styled.img`
  object-fit: cover;
  width: 80px;
  height: 50px;
  border-radius: ${DEFAULT_BORDER_RADIUS};
  margin-right: 8px;
`;

const Text = styled(BaseText)`
  font-weight: ${FONT_WEIGHT_LIGHT};
  font-size: ${FONT_SIZE_SMALL};
  color: ${DARK_TEXT_COLOR};
`;
