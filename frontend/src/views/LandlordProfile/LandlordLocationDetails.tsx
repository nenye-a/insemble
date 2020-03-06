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

export default function LandlordLocationDetails() {
  let history = useHistory();
  let location = history.location.state.iframeSource;
  let { propertyId = '' } = useParams();
  let { data, loading, error, refetch } = useQuery<
    PropertyLocationDetails,
    PropertyLocationDetailsVariables
  >(GET_PROPERTY_LOCATION_DETAILS, {
    variables: {
      propertyId,
    },
  });

  let keyFactsData = data?.propertyDetails.keyFacts;
  let demographicsData = [
    data?.propertyDetails.demographics1,
    data?.propertyDetails.demographics3,
    data?.propertyDetails.demographics5,
  ];
  let commuteData = data?.propertyDetails.commute;
  let personasData = data?.propertyDetails.topPersonas;
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
          <Iframe src={location} />
          <KeyFacts keyFactsData={keyFactsData} commuteData={commuteData} withMargin={false} />
          <ConsumerPersonaText>All Consumer Personas</ConsumerPersonaText>
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
