import React from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { View, LoadingIndicator, Text, Button } from '../../core-ui';
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
import { ALERT_BACKGROUND_COLOR, LIGHTEST_GREY } from '../../constants/colors';
import RelevantConsumerCard from '../DeepDivePage/RelevantConsumerCard';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_BOLD } from '../../constants/theme';
import BlurredPersonas from '../../assets/images/blurred-personas.png';

type Params = {
  paramsId: string;
};

const LOADING_ERROR = 'Your location details are loading';

export default function LandlordLocationDetails() {
  let history = useHistory();
  let { data: tierData } = useQuery(GET_USER_STATE);
  let { trial } = tierData.userState;
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
          {!trial ? (
            <TrialEndedBanner>
              <Text>{`Looks like your trial has ended, but it's easy to get back up and running`}</Text>
              <Button
                text="See Location Details"
                onPress={() => history.push('/landlord/billing')}
              />
            </TrialEndedBanner>
          ) : null}

          <Iframe src={iframeSource} />
          <KeyFacts
            totalValue={totalValue}
            keyFactsData={keyFactsData}
            commuteData={commuteData}
            withMargin={false}
          />
          <ConsumerPersonaText>Local Consumer Personas (Psychographics)</ConsumerPersonaText>
          {!trial ? (
            <Image src={BlurredPersonas} />
          ) : (
            <Container flex>
              <CardsContainer>
                {personasData &&
                  personasData.map((item, index) => <RelevantConsumerCard key={index} {...item} />)}
              </CardsContainer>
            </Container>
          )}

          <GraphicContainer>
            <DemographicCard
              isLocked={!trial}
              demographicsData={demographicsData}
              withMargin={false}
            />
          </GraphicContainer>
        </>
      )}
    </View>
  );
}

const Container = styled(View)`
  flex-wrap: wrap;
  overflow-x: scroll;
`;

const ConsumerPersonaText = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin: 30px 10px 10px;
`;

const CardsContainer = styled(View)`
  padding: 30px;
  flex-direction: row;
  background-color: ${LIGHTEST_GREY};
`;

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

const TrialEndedBanner = styled(View)`
  background-color: ${ALERT_BACKGROUND_COLOR}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  `;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
`;
