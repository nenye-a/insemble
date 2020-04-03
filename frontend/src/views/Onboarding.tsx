import React, { useState, useReducer, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useHistory, Redirect, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { View } from '../core-ui';
import OnboardingCard from './OnboardingPage/OnboardingCard';
import ConfirmBusinessDetail from './OnboardingPage/ConfirmBusinessDetail';
import TenantGoals from './OnboardingPage/TenantGoals';
import TenantTargetCustomers from './OnboardingPage/TenantTargetCustomers';
import TenantPhysicalCriteria from './OnboardingPage/TenantPhysicalCriteria';
import OnboardingSignUp from './OnboardingPage/OnboardingSignUp';
import { useViewport } from '../utils';
import { UPDATE_TENANT_ONBOARDING } from '../graphql/queries/client/tenantOnboarding';

type Params = {
  formStep?: string;
};

export default function Onboarding() {
  let [updateTenantOnboarding] = useMutation(UPDATE_TENANT_ONBOARDING);
  let params = useParams<Params>();
  let history = useHistory();
  let { state: landingState } = history.location;

  let [selectedStep, setSelectedStep] = useState(params.formStep);

  let { isDesktop } = useViewport();

  let updateState = async () => {
    let { name, lat, lng, formattedAddress } = landingState;
    await updateTenantOnboarding({
      variables: {
        confirmBusinessDetail: {
          name,
          location: {
            lat,
            lng,
            address: formattedAddress,
          },
        },
      },
    });
  };

  useEffect(() => {
    if (landingState && !landingState.newPlace) {
      updateState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.formStep]);

  useEffect(() => {
    setSelectedStep(params.formStep || 'step-1');
  }, [params.formStep]);

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

  let Content = selectedPage.content;
  if (!params?.formStep) {
    return <Redirect to="/verify/step-1" />;
  }
  // else if (!state.confirmBusinessDetail.name && params.formStep !== 'step-1') {
  //   return <Redirect to="/" />;
  // }
  return (
    <Container flex isDesktop={isDesktop}>
      <OnboardingCard
        title={selectedPage.title}
        progress={SEGMENTS.indexOf(selectedPage) / SEGMENTS.length}
        flex
      >
        <Content />
      </OnboardingCard>
    </Container>
  );
}

type ContainerProps = ViewProps & {
  isDesktop: boolean;
};

const Container = styled(View)<ContainerProps>`
  align-items: center;
  ${(props) =>
    props.isDesktop
      ? css`
          margin: 24px;
        `
      : css`
          min-height: 90vh;
        `}
`;
