import React, { ComponentProps, useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View, Text, TouchableOpacity, LoadingIndicator } from '../../core-ui';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';
import {
  FONT_WEIGHT_MEDIUM,
  FONT_SIZE_LARGE,
  FONT_WEIGHT_HEAVY,
  FONT_SIZE_SMALL,
  DEFAULT_BORDER_RADIUS,
} from '../../constants/theme';
import { DARK_TEXT_COLOR, WHITE, SECONDARY_COLOR, THEME_COLOR } from '../../constants/colors';
import { GET_PROPERTY_MATCHES_DATA } from '../../graphql/queries/server/matches';
import {
  PropertyMatches_propertyMatches_data as PropertyMatchesData,
  PropertyMatches_propertyMatches_data_contacts as Contacts,
  PropertyMatchesVariables,
  PropertyMatches,
} from '../../generated/PropertyMatches';
import { Property_property_space as Space } from '../../generated/Property';
import { LandlordTier } from '../../generated/globalTypes';
import { EmptyDataComponent, ErrorComponent, TrialEndedAlert } from '../../components';
import { roundDecimal, useViewport } from '../../utils';
import { VIEWPORT_TYPE } from '../../constants/viewports';
import BlurredTenantMatches from '../../assets/images/blurred-tenant-matches.png';

export type SelectedBrand = {
  matchId: string | null;
  brandId: string;
  tenantPhoto: string;
  matchScore: number;
  contacts: Contacts;
  brandName: string;
  category: string;
};

type Props = {
  onPress: (selectedData: SelectedBrand) => void;
  tier?: LandlordTier;
  selectedSpace: Space;
  propertyId: string;
};

export default function LandlordTenantMatches({ onPress, tier, selectedSpace, propertyId }: Props) {
  let { data, loading, error, refetch, stopPolling } = useQuery<
    PropertyMatches,
    PropertyMatchesVariables
  >(GET_PROPERTY_MATCHES_DATA, {
    variables: { propertyId, spaceId: selectedSpace?.id || '' },
    skip: !selectedSpace?.id || !propertyId,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    pollInterval: 10000,
  });

  let matchResult = useMemo(() => {
    if (!data?.propertyMatches.data) {
      return data?.propertyMatches.data;
    }
    return data.propertyMatches.data.sort(
      (
        { matchValue: matchValueA, numExistingLocations: numExistingLocationsA },
        { matchValue: matchValueB, numExistingLocations: numExistingLocationsB }
      ) => {
        let sortValue = matchValueB - matchValueA;
        if (sortValue === 0) {
          sortValue = numExistingLocationsB - numExistingLocationsA;
        }
        return sortValue;
      }
    );
  }, [data]);

  let lockedMatches = (
    <>
      {matchResult && matchResult[0] && <TenantCard item={matchResult[0]} onPress={onPress} />}
      <BlurredImage src={BlurredTenantMatches} />
    </>
  );

  let allMatches =
    matchResult &&
    matchResult.map((item, index) => {
      return <TenantCard key={index} item={item} onPress={onPress} />;
    });

  let content =
    tier === LandlordTier.PROFESSIONAL ? (
      allMatches
    ) : tier === LandlordTier.BASIC ? (
      <Row flex>{lockedMatches}</Row>
    ) : null;

  useEffect(() => {
    if (!data?.propertyMatches.polling) {
      stopPolling();
    }
  }, [data, stopPolling]);
  return (
    <>
      {loading || data?.propertyMatches.polling ? (
        <Container flex>
          <LoadingIndicator flex size="large" text="Loading the matches for your space." />
        </Container>
      ) : error || data?.propertyMatches.error ? (
        <Container flex>
          <ErrorComponent onRetry={refetch} />
        </Container>
      ) : !data?.propertyMatches.data ? (
        <EmptyDataComponent />
      ) : (
        <>
          {tier === LandlordTier.BASIC && <TrialEndedAlert text="See All Retailers" />}
          <TenantContainer>{content}</TenantContainer>
        </>
      )}
    </>
  );
}

type TenantCardProps = {
  item: PropertyMatchesData;
  onPress: (selectedData: SelectedBrand) => void;
};

function TenantCard({ item, onPress }: TenantCardProps) {
  let matchScore = roundDecimal(item.matchValue);
  let { viewportType } = useViewport();
  return (
    <TenantCardContainer
      isInterested={item.interested}
      viewportType={viewportType}
      onPress={() =>
        onPress({
          matchId: item.matchId,
          brandId: item.brandId,
          tenantPhoto: item.pictureUrl,
          matchScore: Number(matchScore),
          contacts: item.contacts[0],
          brandName: item.name,
          category: item.category,
        })
      }
    >
      {item.interested ? (
        <InterestedContainer>
          <InterestedText>Interested</InterestedText>
        </InterestedContainer>
      ) : null}
      <Image src={item.pictureUrl || imgPlaceholder} />
      <DescriptionContainer>
        <RowedView flex>
          <View style={{ flex: 1 }}>
            <CardTitle>{item.name}</CardTitle>
            <CardCategoryText>{item.category}</CardCategoryText>
          </View>
          <View>
            <CardPercentage>{matchScore}%</CardPercentage>
            <Text>Match</Text>
          </View>
        </RowedView>
        <CardExistingLocationText>
          {item.numExistingLocations} existing locations
        </CardExistingLocationText>
      </DescriptionContainer>
    </TenantCardContainer>
  );
}

const Image = styled.img`
  height: 120px;
  object-fit: cover;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const Container = styled(RowedView)`
  flex-wrap: wrap;
  align-items: center;
  overflow-y: scroll;
`;

const InterestedText = styled(Text)`
  color: ${WHITE};
  align-self: center;
`;

type TenantCardPropsContainer = ComponentProps<typeof TouchableOpacity> & {
  isInterested: boolean;
  viewportType: VIEWPORT_TYPE;
};

const TenantCardContainer = styled(TouchableOpacity)<TenantCardPropsContainer>`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  background-color: ${WHITE};
  ${(props) =>
    props.viewportType === VIEWPORT_TYPE.DESKTOP
      ? css`
          width: calc(33.33% - 11px);
          margin: 12px 16px 12px 0;
          &:nth-child(3n) {
            margin-right: 0;
          }
        `
      : props.viewportType === VIEWPORT_TYPE.TABLET
      ? css`
          width: 45%;
          margin: 6px 12px 6px 0;
          &:nth-child(2n) {
            margin-right: 0;
          }
        `
      : css`
          width: 100%;
          margin: 6px 0;
        `}
  height: fit-content;
  box-shadow: ${(props) => props.isInterested && `0px 0px 10px 0px ${SECONDARY_COLOR}`};
`;

const InterestedContainer = styled(View)`
  width: 100%;
  position: absolute;
  background-color: ${THEME_COLOR};
  align-items: center;
  justify-content: center;
  padding: 2px 0;
  border-top-left-radius: ${DEFAULT_BORDER_RADIUS};
  border-top-right-radius: ${DEFAULT_BORDER_RADIUS};
`;

const DescriptionContainer = styled(View)`
  padding: 12px;
  min-height: 130px;
`;

const CardTitle = styled(Text)`
  color: ${THEME_COLOR};
  font-weight: ${FONT_WEIGHT_MEDIUM};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CardPercentage = styled(Text)`
  color: ${THEME_COLOR};
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_HEAVY};
  width: 54px;
`;

const CardCategoryText = styled(Text)`
  color: ${DARK_TEXT_COLOR};
  font-size: ${FONT_SIZE_SMALL};
`;

const CardExistingLocationText = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
`;

const BlurredImage = styled.img`
  width: 100%;
  object-fit: cover;
`;

const TenantContainer = styled(Container)`
  padding: 0 20px;
  /* to make the cards left aligned if there's less than 3 card per row */
  justify-content: flex-start;
`;

const Row = styled(View)`
  flex-direction: row;
`;
