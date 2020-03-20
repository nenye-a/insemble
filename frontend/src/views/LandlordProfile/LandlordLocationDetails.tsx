import React from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { View, Text, LoadingIndicator, Button } from '../../core-ui';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_BOLD, FONT_SIZE_LARGE } from '../../constants/theme';
import { LIGHTEST_GREY } from '../../constants/colors';
import KeyFacts from '../DeepDivePage/KeyFacts';
import RelevantConsumerCard from '../DeepDivePage/RelevantConsumerCard';
import DemographicCard from '../../core-ui/Demographics';
import { GET_PROPERTY_LOCATION_DETAILS } from '../../graphql/queries/server/deepdive';
import {
  PropertyLocationDetails,
  PropertyLocationDetailsVariables,
} from '../../generated/PropertyLocationDetails';
import { MAPS_IFRAME_URL_SEARCH } from '../../constants/googleMaps';

export default function LandlordLocationDetails() {
  let history = useHistory();
  let { paramsId: propertyId = '' } = useParams();
  let { lat, lng } = history.location.state.property.location;
  let iframeSource = MAPS_IFRAME_URL_SEARCH + '&q=' + lat + ', ' + lng;
  let { data, loading, error, refetch } = useQuery<
    PropertyLocationDetails,
    PropertyLocationDetailsVariables
  >(GET_PROPERTY_LOCATION_DETAILS, {
    variables: {
      propertyId,
    },
    notifyOnNetworkStatusChange: true,
  });

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
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <CenteredView flex>
          <Text fontSize={FONT_SIZE_LARGE}>{error.message || ''}</Text>
          <Button text="Try Again" onPress={refetch} />
        </CenteredView>
      ) : (
        // {/* TODO: change to map */}
        <>
          <Iframe src={iframeSource} />
          <KeyFacts
            totalValue={totalValue}
            keyFactsData={keyFactsData}
            commuteData={commuteData}
            withMargin={false}
          />
          <ConsumerPersonaText>Local Consumer Personas (Psychographics)</ConsumerPersonaText>
          <Container flex>
            <CardsContainer>
              {personasData &&
                personasData.map((item, index) => <RelevantConsumerCard key={index} {...item} />)}
            </CardsContainer>
          </Container>
          <GraphicContainer>
            <DemographicCard demographicsData={demographicsData} withMargin={false} />
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
`;
const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 240px;
  border: none;
`;
const CenteredView = styled(View)`
  justify-content: center;
  align-items: center;
`;
