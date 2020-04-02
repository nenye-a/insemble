import React, { ComponentProps } from 'react';
import styled, { css } from 'styled-components';

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
import {
  PropertyMatches_propertyMatches as PropertyMatchesProps,
  PropertyMatches_propertyMatches_contacts as Contacts,
} from '../../generated/PropertyMatches';
import { EmptyDataComponent } from '../../components';
import { roundDecimal, useViewport } from '../../utils';
import { VIEWPORT_TYPE } from '../../constants/viewports';

export type SelectedBrand = {
  matchId: string | null;
  brandId: string;
  tenantPhoto: string;
  matchScore: number;
  contacts: Contacts;
};

type Props = {
  onPress: (selectedData: SelectedBrand) => void;
  matchResult?: Array<PropertyMatchesProps>;
  loading: boolean;
};

export default function LandlordTenantMatches({ onPress, matchResult, loading }: Props) {
  let { viewportType } = useViewport();
  return (
    <Container flex>
      {loading ? (
        <LoadingIndicator size="large" text="Loading the matches for your space." />
      ) : !matchResult ? (
        <EmptyDataComponent />
      ) : (
        matchResult &&
        matchResult.map((item, index) => {
          let matchScore = roundDecimal(item.matchValue);
          return (
            <TenantCard
              key={index}
              isInterested={item.interested}
              viewportType={viewportType}
              onPress={() =>
                onPress({
                  matchId: item.matchId,
                  brandId: item.brandId,
                  tenantPhoto: item.pictureUrl,
                  matchScore: Number(matchScore),
                  contacts: item.contacts[0],
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
            </TenantCard>
          );
        })
      )}
    </Container>
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
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
  overflow: visible;
`;

const InterestedText = styled(Text)`
  color: ${WHITE};
  align-self: center;
`;

type TenantCardProps = ComponentProps<typeof TouchableOpacity> & {
  isInterested: boolean;
  viewportType: VIEWPORT_TYPE;
};

const TenantCard = styled(TouchableOpacity)<TenantCardProps>`
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
