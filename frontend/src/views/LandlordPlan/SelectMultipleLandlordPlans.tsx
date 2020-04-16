import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Button, Text as BaseText, RadioGroup } from '../../core-ui';
import { DataTable } from '../../components';
import CardFooter from '../../components/layout/OnboardingFooter';
import {
  FONT_WEIGHT_LIGHT,
  FONT_SIZE_SMALL,
  FONT_SIZE_LARGE,
  DEFAULT_BORDER_RADIUS,
} from '../../constants/theme';
import { SUPPORT_EMAIL } from '../../constants/app';
import { LandlordTier, LandlordTiers } from '../../constants/SubscriptionTiers';
import { DARK_TEXT_COLOR } from '../../constants/colors';
import { LANDLORD_BILLING_LIST } from '../../fixtures/dummyData';

type BilledLandlordTier = LandlordTier.BASIC | LandlordTier.PROFESSIONAL;

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
export default function SelectMultipleLandlordPlans() {
  let history = useHistory();
  let [billingList, setBillingList] = useState(LANDLORD_BILLING_LIST);

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
              let { mainPhoto, address, spaceNumber, isAnnual, tier, id } = space;
              return (
                <LandlordPlanRow
                  key={index}
                  mainPhoto={mainPhoto}
                  address={address}
                  spaceNumber={spaceNumber}
                  tier={tier as BilledLandlordTier}
                  isAnnual={isAnnual}
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
        <Button
          text="Next"
          onPress={() => {
            history.push('/landlord/change-plans/confirm-plans');
          }}
        />
      </CardFooter>
    </View>
  );
}

type LandlordPlanRowProps = {
  mainPhoto: string;
  address: string;
  spaceNumber: number;
  isAnnual: boolean;
  onPlanSelect: (item: PlanRadioGroup) => void;
  onTermSelect: (item: TermRadioGroup) => void;
  tier: BilledLandlordTier;
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
