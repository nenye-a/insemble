import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Button, Text as BaseText, RadioGroup } from '../../core-ui';
import { DataTable, ContactInsemble } from '../../components';
import CardFooter from '../../components/layout/OnboardingFooter';
import {
  FONT_WEIGHT_LIGHT,
  FONT_SIZE_SMALL,
  FONT_SIZE_LARGE,
  DEFAULT_BORDER_RADIUS,
} from '../../constants/theme';
import { LandlordTiers } from '../../constants/SubscriptionTiers';
import { DARK_TEXT_COLOR } from '../../constants/colors';
import { GetSubscriptionsList_landlordSubscriptions as LandlordSubscriptions } from '../../generated/GetSubscriptionsList';
import { isEqual } from '../../utils';
import { LandlordTier } from '../../generated/globalTypes';

type BilledLandlordTier = LandlordTier.BASIC | LandlordTier.PROFESSIONAL;

type BilledSubscriptions = LandlordSubscriptions & {
  isAnnual?: boolean;
};

type PlanRadioGroup = {
  label: string;
  value: BilledLandlordTier;
};

type TermRadioGroup = {
  label: string;
  value: number;
};

const PLAN_OPTIONS: Array<PlanRadioGroup> = [
  { label: 'Basic', value: LandlordTier.BASIC },
  { label: 'Pro', value: LandlordTier.PROFESSIONAL },
];

const TERM_OPTIONS = [
  {
    label: 'Monthly',
    value: 1,
  },
  {
    label: 'Annually',
    value: 12,
  },
];

export type InvoiceList = {
  spaceId: string;
  planId: string;
  tierName: string;
  price: number;
  isAnnual: boolean;
};

type Props = {
  subscriptionList: Array<BilledSubscriptions>;
};

export default function SelectMultipleLandlordPlans({ subscriptionList }: Props) {
  let history = useHistory();

  let [billingList, setBillingList] = useState(subscriptionList);
  let isBillingListEqual = isEqual(subscriptionList, billingList);
  let onPlanSelect = (selectedPlan: PlanRadioGroup, id: string) => {
    let newBillingList = billingList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          tier: selectedPlan.value,
        };
      }
      return item;
    });
    setBillingList(newBillingList);
  };
  let onTermSelect = (selectedTerm: TermRadioGroup, id: string) => {
    let newBillingList = billingList.map((item) => {
      if (item.id === id) {
        return { ...item, isAnnual: selectedTerm.value === 12 };
      }
      return item;
    });
    setBillingList(newBillingList);
  };
  let onPressNext = () => {
    let filtered = billingList.filter((bill) => !subscriptionList.includes(bill));
    let invoiceList: Array<InvoiceList> = [];
    if (filtered.length > 0) {
      // eslint-disable-next-line array-callback-return
      filtered.map((item) => {
        let itemTier = item.tier as BilledLandlordTier;
        let price = item.isAnnual
          ? LandlordTiers[itemTier].yearly.price
          : LandlordTiers[itemTier].monthly.price;
        let planId = item.isAnnual
          ? LandlordTiers[itemTier].yearly.id
          : LandlordTiers[itemTier].monthly.id;
        let newInvoice = {
          spaceId: item.id,
          planId,
          tierName: item.tier,
          price: price,
          isAnnual: item.isAnnual ? item.isAnnual : false,
        };
        invoiceList.push(newInvoice);
      });
    }
    history.push('/landlord/change-plans/confirm-plans', {
      ...history.location.state,
      invoiceList,
    });
  };
  return (
    <View>
      <Container>
        <Title>Select Plans For your Property</Title>
        <ContactInsemble />
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
              let {
                mainPhoto,
                location: { address },
                spaceIndex,
                tier,
                id,
                isAnnual,
                plan,
              } = space;
              let annual = !isAnnual
                ? plan.id === LandlordTiers[tier as BilledLandlordTier].yearly.id
                : false;
              return (
                <LandlordPlanRow
                  key={index}
                  mainPhoto={mainPhoto}
                  address={address}
                  spaceNumber={spaceIndex}
                  tier={tier as BilledLandlordTier}
                  isAnnual={annual}
                  onPlanSelect={(item) => onPlanSelect(item, id)}
                  onTermSelect={(item) => onTermSelect(item, id)}
                />
              );
            })}
          </DataTable>
        </TableWrapper>
      </Container>
      <CardFooter>
        <BackButton
          mode="transparent"
          text="Back"
          onPress={() => {
            history.goBack();
          }}
        />
        <Button text="Next" disabled={isBillingListEqual} onPress={onPressNext} />
      </CardFooter>
    </View>
  );
}

type LandlordPlanRowProps = {
  mainPhoto: string;
  address: string;
  spaceNumber: number;
  onPlanSelect: (item: PlanRadioGroup) => void;
  onTermSelect: (item: TermRadioGroup) => void;
  tier: BilledLandlordTier;
  isAnnual?: boolean;
};

function LandlordPlanRow(props: LandlordPlanRowProps) {
  let { mainPhoto, address, spaceNumber, isAnnual, onPlanSelect, onTermSelect, tier } = props;
  let month = isAnnual ? 12 : 1;
  let selectedPlan = PLAN_OPTIONS.find((plan) => plan.value === tier);
  let selectedTerm = TERM_OPTIONS.find((term) => term.value === month);

  let pricePerMonth = isAnnual
    ? LandlordTiers[tier].yearly.price
    : LandlordTiers[tier].monthly.price;
  let labelProps = {
    style: {
      fontSize: FONT_SIZE_SMALL,
      fontWeight: FONT_WEIGHT_LIGHT,
      color: DARK_TEXT_COLOR,
    },
  };

  return (
    <DataTable.Row height="60px">
      <DataTable.Cell width={250}>
        <Image src={mainPhoto} />
        <Text>{address}</Text>
      </DataTable.Cell>
      <DataTable.Cell width={50}>
        <Text>{spaceNumber}</Text>
      </DataTable.Cell>
      <DataTable.Cell width={120}>
        <RadioGroup<PlanRadioGroup>
          options={PLAN_OPTIONS}
          titleExtractor={({ label }) => label}
          onSelect={onPlanSelect}
          labelProps={labelProps}
          selectedOption={selectedPlan}
        />
      </DataTable.Cell>
      <DataTable.Cell width={120}>
        <RadioGroup<TermRadioGroup>
          options={TERM_OPTIONS}
          titleExtractor={({ label }) => label}
          labelProps={labelProps}
          onSelect={onTermSelect}
          selectedOption={selectedTerm}
        />
      </DataTable.Cell>
      <DataTable.Cell align="right" style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
        <Text>${pricePerMonth}/month</Text>
        {isAnnual && <Text>*paid annually</Text>}
      </DataTable.Cell>
    </DataTable.Row>
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

const BackButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
`;
