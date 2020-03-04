import React, { useState, useReducer, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, Redirect, useParams } from 'react-router-dom';
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
import { CREATE_BRAND, GET_BRANDS } from '../graphql/queries/server/brand';
import asyncStorage from '../utils/asyncStorage';
import { CreateBrandVariables, CreateBrand } from '../generated/CreateBrand';

type Params = {
  formStep?: string;
};

export default function Onboarding() {
  let params = useParams<Params>();
  let history = useHistory();

  let [createBrand, { loading, data }] = useMutation<CreateBrand, CreateBrandVariables>(
    CREATE_BRAND,
    { refetchQueries: [{ query: GET_BRANDS }] }
  );
  let [selectedStep, setSelectedStep] = useState(params.formStep);
  // let history = useHistory();
  let [state, dispatch] = useReducer(tenantOnboardingReducer, tenantOnboardingInitialState);
  // let signedUp = asyncStorage.getTenantToken();

  useEffect(() => {
    let { state: landingState } = history.location;
    if (history.location.state) {
      let { name, lat, lng, formattedAddress } = landingState;
      dispatch({
        type: 'SAVE_CHANGES_CONFIRM_BUSINESS_DETAIL',
        values: {
          ...state,
          confirmBusinessDetail: {
            ...state.confirmBusinessDetail,
            name,
            location: {
              lat,
              lng,
              address: formattedAddress,
            },
          },
        },
      });
    }
  }, [params.formStep]);

  useEffect(() => {
    setSelectedStep(params.formStep || 'step-1');
  }, [params.formStep]);

  let onSubmit = () => {
    let { confirmBusinessDetail, tenantGoals, targetCustomers, physicalSiteCriteria } = state;
    let { categories, name, userRelation, otherUserRelation, location } = confirmBusinessDetail;
    let {
      noPersonasPreference,
      noAgePreference,
      noIncomePreference,
      noEducationsPreference,
      personas,
      minAge,
      maxAge,
      minIncome,
      maxIncome,
      educations,
      minDaytimePopulation,
    } = targetCustomers;
    let { minSize, minFrontageWidth, spaceType, equipments } = physicalSiteCriteria;
    createBrand({
      variables: {
        business: {
          name,
          userRelation: userRelation === 'Other' ? otherUserRelation || '' : userRelation,
          location: location || { lat: '', lng: '', address: '' },
          locationCount: tenantGoals.locationCount ? Number(tenantGoals.locationCount) : null,
          newLocationPlan: tenantGoals.newLocationPlan?.value,
          nextLocations: tenantGoals.location,
        },
        filter: {
          categories,
          personas: noPersonasPreference ? null : personas,
          education: noEducationsPreference ? null : educations,
          minDaytimePopulation: minDaytimePopulation ? null : Number(minDaytimePopulation),
          minAge: noAgePreference ? null : Number(minAge),
          maxAge: noAgePreference ? null : Number(maxAge),
          minIncome: noIncomePreference ? null : Number(minIncome) * 1000,
          maxIncome: noIncomePreference ? null : Number(maxIncome) * 1000,
          minSize: Number(minSize),
          minFrontageWidth: Number(minFrontageWidth),
          spaceType,
          equipment: equipments,
        },
      },
    });
  };

  const SEGMENTS = [
    {
      title: 'Let’s confirm your business details.',
      content: ConfirmBusinessDetail,
      path: 'step-1',
    },
    {
      title: 'What are your goals?',
      content: TenantGoals,
      path: 'step-2',
    },
    {
      title: 'Who are your target customers?',
      content: TenantTargetCustomers,
      path: 'step-3',
    },
    {
      title: 'What is your physical site criteria?',
      content: TenantPhysicalCriteria,
      path: 'step-4',
    },
    {
      title: 'Almost Done. Sign up to instantly see your matches.',
      content: OnboardingSignUp,
      path: 'step-5',
    },
  ];

  let selectedPage = SEGMENTS.find((item) => item.path === selectedStep) || SEGMENTS[0];
  console.log(selectedPage, 'SEL PAGE');
  let Content = selectedPage.content;
  // if (!selectedPage || !history.location.state) {
  //   return <Redirect to="/" />;
  // }
  // if (!params?.formStep) {
  //   // TODO: check if user directly hit next step before filling previous form
  //   return <Redirect to="/verify/step-1" />;
  // }
  // if (data && data.createBrand) {
  //   let brandId = data.createBrand;
  //   return <Redirect to={`/map/${brandId}`} />;
  // } else if (!history.location.state) {
  //   return <Redirect to="/" />;
  // }
  return (
    <Container flex>
      <OnboardingCard
        title={selectedPage.title}
        progress={SEGMENTS.indexOf(selectedPage) / SEGMENTS.length}
        canPressNext={state.canPressNext}
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
