import React from 'react';
import styled from 'styled-components';

import DataTable from '../components/DataTable';
import { SECONDARY_COLOR, DARK_TEXT_COLOR } from '../constants/colors';
import { Text, Button, View } from '../core-ui';
import { FONT_WEIGHT_LIGHT } from '../constants/theme';

type BillingList = {
  photos: string;
  address: string;
  space: number;
  plan: string;
  cost: string;
};

export default function LandlordPLan() {
  let billingList = [
    {
      photos: 'asd',
      address: '4th street',
      space: 2,
      plan: 'Pro',
      cost: '30/monthly',
    },
  ];
  return (
    <Container>
      <RowView>
        <SectionTitle>Billing Summary</SectionTitle>
        <Button text="Change multiple plans" mode="transparent" onPress={() => {}} />
      </RowView>
      <DataTable>
        <DataTable.HeaderRow>
          <DataTable.HeaderCell width={260} align="center">
            Property
          </DataTable.HeaderCell>
          <DataTable.HeaderCell width={100} align="center">
            Space
          </DataTable.HeaderCell>
          <DataTable.HeaderCell width={100} align="center">
            Plan
          </DataTable.HeaderCell>
          <DataTable.HeaderCell width={140} align="center">
            Cost
          </DataTable.HeaderCell>
          <DataTable.HeaderCell width={140} align="center"></DataTable.HeaderCell>
        </DataTable.HeaderRow>
        {billingList.map((item, index) => (
          <ListOfBilling key={index} {...item} />
        ))}
      </DataTable>
    </Container>
  );
}

type BillingRowProps = BillingList;

function ListOfBilling(props: BillingRowProps) {
  let { photos, address, space, plan, cost } = props;

  return (
    <DataTable.Row height={'50px'}>
      <DataTable.Cell width={260} align="center">
        <Image src={photos} />
        <TableText>{address}</TableText>
      </DataTable.Cell>
      <DataTable.Cell width={100} align="center">
        <TableText>{space}</TableText>
      </DataTable.Cell>
      <DataTable.Cell width={100} align="center">
        <Button text={plan} onPress={() => {}} />
      </DataTable.Cell>
      <DataTable.Cell width={140} align="center">
        <TableText>${cost}</TableText>
      </DataTable.Cell>
      <DataTable.Cell width={140} align="center">
        <Button text="Change plan" mode="transparent" onPress={() => {}} />
      </DataTable.Cell>
    </DataTable.Row>
  );
}

const SectionTitle = styled(Text)`
  color: ${SECONDARY_COLOR};
`;
const Container = styled(View)`
  padding-top: 20px;
`;
const Image = styled.img`
  margin-right: 20px;
`;
const RowView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;
const TableText = styled(Text)`
  font-weight: ${FONT_WEIGHT_LIGHT};
  color: ${DARK_TEXT_COLOR};
`;
