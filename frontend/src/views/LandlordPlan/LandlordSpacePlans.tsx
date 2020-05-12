import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import DataTable from '../../components/DataTable';
import { SECONDARY_COLOR, DARK_TEXT_COLOR } from '../../constants/colors';
import { Text, Button, View, LoadingIndicator } from '../../core-ui';
import { FONT_WEIGHT_LIGHT, DEFAULT_BORDER_RADIUS } from '../../constants/theme';
import { GET_LANDLORD_SUBSCRIPTIONS_LIST } from '../../graphql/queries/server/landlordSubscription';
import { GetSubscriptionsList } from '../../generated/GetSubscriptionsList';

type BillingList = {
  photos: string;
  address: string;
  space: number;
  plan: string;
  cost: string;
  spaceId: string;
};

export default function LandlordSpacePlans() {
  let history = useHistory();
  let { data: subListData, loading: subListLoading } = useQuery<GetSubscriptionsList>(
    GET_LANDLORD_SUBSCRIPTIONS_LIST
  );
  let subscriptionList = subListData?.landlordSubscriptions;
  return (
    <Container>
      <RowView>
        <SectionTitle>Space Plans</SectionTitle>
        {subscriptionList && subscriptionList.length > 0 ? (
          <Button
            text="Change multiple plans"
            mode="transparent"
            onPress={() => {
              history.push('/landlord/change-plans/view-plans', {
                subscriptionList,
              });
            }}
          />
        ) : null}
      </RowView>
      <DataTable>
        <DataTable.HeaderRow>
          <DataTable.HeaderCell width={300} align="center">
            Property
          </DataTable.HeaderCell>
          <DataTable.HeaderCell align="center">Space</DataTable.HeaderCell>
          <DataTable.HeaderCell width={140} align="center">
            Plan
          </DataTable.HeaderCell>
          <DataTable.HeaderCell align="center">Cost</DataTable.HeaderCell>
          <DataTable.HeaderCell width={140} align="center"></DataTable.HeaderCell>
        </DataTable.HeaderRow>
        {subListLoading ? (
          <LoadingIndicator />
        ) : (
          subscriptionList &&
          subscriptionList.map((item, index) => (
            <ListOfBilling
              key={index}
              photos={item.mainPhoto}
              address={item.location.address}
              space={item.spaceIndex}
              plan={item.tier}
              cost={item.cost}
              spaceId={item.id}
            />
          ))
        )}
      </DataTable>
    </Container>
  );
}

type BillingRowProps = BillingList;

function ListOfBilling(props: BillingRowProps) {
  let { photos, address, space, plan, cost, spaceId } = props;
  let history = useHistory();
  return (
    <DataTable.Row height="60px">
      <DataTable.Cell width={300} align="center">
        <ImageContainer flex>
          <Image src={photos} />
        </ImageContainer>
        <View style={{ flex: 2 }}>
          <TableText>{address}</TableText>
        </View>
      </DataTable.Cell>
      <DataTable.Cell align="center">
        <TableText>{space}</TableText>
      </DataTable.Cell>
      <DataTable.Cell width={140} align="center">
        <Button text={plan} onPress={() => {}} />
      </DataTable.Cell>
      <DataTable.Cell align="center">
        <TableText>{cost}</TableText>
      </DataTable.Cell>
      <DataTable.Cell width={140} align="center">
        <Button
          text="Change plan"
          mode="transparent"
          onPress={() =>
            history.push('/landlord/change-plan/view-plan', {
              spaceId,
            })
          }
        />
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
  width: 100%;
  height: 100%;
  border-radius: ${DEFAULT_BORDER_RADIUS};
  object-fit: cover;
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

const ImageContainer = styled(View)`
  width: 100px;
  height: 40px;
  margin-right: 20px;
`;
