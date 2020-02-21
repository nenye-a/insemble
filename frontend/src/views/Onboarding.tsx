import React, { useState, useReducer } from 'react';
import styled from 'styled-components';
import { useHistory, Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { View } from '../core-ui';
import OnboardingCard from './OnboardingPage/OnboardingCard';
import ConfirmBusinessDetail from './OnboardingPage/ConfirmBusinessDetail';
import TenantGoals from './OnboardingPage/TenantGoals';
import TenantTargetCustomers from './OnboardingPage/TenantTargetCustomers';
import TenantPhysicalCriteria from './OnboardingPage/TenantPhysicalCriteria';
import OnboardingSignUp from './OnboardingPage/OnboardingSignUp';
import tenantOnboardingReducer, {
  tenantOnboardingInitialState,
} from '../reducers/tenantOnboardingReducer';
import { CREATE_BRAND } from '../graphql/queries/server/brand';
import asyncStorage from '../utils/asyncStorage';
import { CreateBrandVariables, CreateBrand } from '../generated/CreateBrand';

export default function Onboarding() {
  let [createBrand, { loading, data }] = useMutation<CreateBrand, CreateBrandVariables>(
    CREATE_BRAND
  );
  let [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  let history = useHistory();
  let [state, dispatch] = useReducer(tenantOnboardingReducer, tenantOnboardingInitialState);
  let signedUp = asyncStorage.getTenantToken();
  let onNextPress = () => setActiveSegmentIndex(activeSegmentIndex + 1);
  let onBackPress = () => setActiveSegmentIndex(activeSegmentIndex - 1);

  let onSubmit = () => {
    let { confirmBusinessDetail, tenantGoals, targetCustomers, physicalSiteCriteria } = state;

    createBrand({
      variables: {
        business: {
          name: confirmBusinessDetail.name,
          userRelation:
            confirmBusinessDetail.userRelation === 'Other'
              ? confirmBusinessDetail.otherUserRelation || ''
              : confirmBusinessDetail.userRelation,
          location: confirmBusinessDetail.location || { lat: '', lng: '', address: '' },
          locationCount: tenantGoals.locationCount ? Number(tenantGoals.locationCount) : null,
          newLocationPlan: tenantGoals.newLocationPlan?.value,
          nextLocations: tenantGoals.location,
        },
        filter: {
          categories: confirmBusinessDetail.categories,
          personas: targetCustomers.noPersonasPreference ? [] : targetCustomers.personas,
          minAge: targetCustomers.noAgePreference ? null : Number(targetCustomers.minAge),
          maxAge: targetCustomers.noAgePreference ? null : Number(targetCustomers.maxAge),
          minIncome: targetCustomers.noIncomePreference ? null : Number(targetCustomers.minIncome),
          maxIncome: targetCustomers.noIncomePreference ? null : Number(targetCustomers.maxIncome),
          minSize: Number(physicalSiteCriteria.minSize),
          maxSize: Number(physicalSiteCriteria.maxSize),
          minFrontageWidth: Number(physicalSiteCriteria.minFrontageWidth),
          maxFrontageWidth: Number(physicalSiteCriteria.maxFrontageWidth),
          spaceType: physicalSiteCriteria.spaceType,
          equipment: physicalSiteCriteria.equipments,
        },
      },
    });
  };

  const SEGMENT_LIST = [
    {
      title: 'Let’s confirm your business details.',
      content: ConfirmBusinessDetail,
      buttons: [
        {
          text: 'Not My Address',
          onPress: () => {
            history.push('/');
          },
        },
        {
          text: 'Done',
          onPress: onNextPress,
        },
      ],
    },
    {
      title: 'What are your goals?',
      content: TenantGoals,
      buttons: [
        {
          text: 'Back',
          onPress: onBackPress,
        },
        {
          text: 'Next',
          onPress: onNextPress,
        },
      ],
    },
    {
      title: 'Who are your target customers?',
      content: TenantTargetCustomers,
      buttons: [
        {
          text: 'Back',
          onPress: onBackPress,
        },
        {
          text: 'Next',
          onPress: onNextPress,
        },
      ],
    },
    {
      title: 'What is your physical site criteria?',
      content: TenantPhysicalCriteria,
      buttons: [
        {
          text: 'Back',
          onPress: onBackPress,
        },
        signedUp
          ? {
              text: 'Submit',
              onPress: onSubmit,
              loading,
            }
          : { text: 'Next', onPress: onNextPress },
      ],
    },
    {
      title: 'Almost Done. Signup to instantly see your matches.',
      content: OnboardingSignUp,
      buttons: [],
    },
  ];

  let segments = signedUp ? SEGMENT_LIST.slice(0, -1) : SEGMENT_LIST;
  let Content = segments[activeSegmentIndex].content;
  if (data && data.createBrand) {
    let brandId = data.createBrand;
    return <Redirect to={`/map/${brandId}`} />;
  } else if (!history.location.state) {
    return <Redirect to="/" />;
  }
  return (
    <Container flex>
      <OnboardingCard
        title={segments[activeSegmentIndex].title}
        progress={activeSegmentIndex / segments.length}
        canPressNext={state.canPressNext}
        buttons={segments[activeSegmentIndex].buttons}
      >
        <Content dispatch={dispatch} state={state} />
      </OnboardingCard>
    </Container>
  );
}

const Container = styled(View)`
  align-items: center;
  margin: 24px;
`;
