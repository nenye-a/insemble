import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { View, LoadingIndicator } from '../../core-ui';
import KeyFacts from '../DeepDivePage/KeyFacts';
import DemographicCard from '../DeepDivePage/Demographics';
import { GET_PROPERTY_LOCATION_DETAILS } from '../../graphql/queries/server/deepdive';
import { GET_PROPERTY } from '../../graphql/queries/server/properties';
import {
  PropertyLocationDetails,
  PropertyLocationDetailsVariables,
} from '../../generated/PropertyLocationDetails';
import { Property, PropertyVariables } from '../../generated/Property';
import { MAPS_IFRAME_URL_SEARCH } from '../../constants/googleMaps';
import { ErrorComponent } from '../../components';
import { GET_USER_STATE } from '../../graphql/queries/client/userState';
import { LandlordTier } from '../../generated/globalTypes';
import RelevantConsumerPersonas from '../DeepDivePage/RelevantConsumerPersonas';

type Params = {
  paramsId: string;
};

const LOADING_ERROR = 'Your location details are loading';

export default function LandlordLocationDetails() {
  let { data: tierData } = useQuery(GET_USER_STATE);
  let isLocked = tierData.userState.tier === LandlordTier.NO_TIER; // TODO: check if trial too
  let { paramsId: propertyId = '' } = useParams<Params>();

  let { data, loading, error, refetch } = useQuery<
    PropertyLocationDetails,
    PropertyLocationDetailsVariables
  >(GET_PROPERTY_LOCATION_DETAILS, {
    variables: {
      propertyId,
    },
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      if (error.message.includes(LOADING_ERROR)) {
        refetch();
      }
    },
  });
  let { data: propertyData, loading: propertyLoading } = useQuery<Property, PropertyVariables>(
    GET_PROPERTY,
    {
      variables: {
        propertyId,
      },
    }
  );

  let iframeSource =
    MAPS_IFRAME_URL_SEARCH +
    '&q=' +
    propertyData?.property.location.lat +
    ', ' +
    propertyData?.property.location.lng;

  let keyFactsData = data?.propertyDetails.keyFacts;
  let demographicsData = [
    data?.propertyDetails.demographics1,
    data?.propertyDetails.demographics3,
    data?.propertyDetails.demographics5,
  ];
  let commuteData = data?.propertyDetails.commute;
  let personasData = data?.propertyDetails.topPersonas;
  let totalValue = 0;
  commuteData &&
    commuteData.forEach((item) => {
      totalValue = totalValue + item.value;
    });

  return (
    <View>
      {loading || propertyLoading || error?.message.includes(LOADING_ERROR) ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorContainer onRetry={refetch} />
      ) : (
        <>
          <Iframe src={iframeSource} />
          <KeyFacts
            totalValue={totalValue}
            keyFactsData={keyFactsData}
            commuteData={commuteData}
            withMargin={false}
          />
          <RelevantConsumerPersonas
            title="Local Consumer Personas"
            isLocked={isLocked}
            personasData={personasData}
          />
          <GraphicContainer>
            <DemographicCard
              isLocked={isLocked}
              demographicsData={demographicsData}
              withMargin={false}
            />
          </GraphicContainer>
        </>
      )}
    </View>
  );
}

const GraphicContainer = styled(View)`
  margin: 0 14px;
  overflow: scroll;
`;
const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 240px;
  border: none;
`;
const ErrorContainer = styled(ErrorComponent)`
  padding: 24px;
`;
