import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
import HeatMapLayer from 'react-google-DELETED_BASE64_STRING';
import { useQuery } from '@apollo/react-hooks';

import { View, Card, Text, PillButton, TouchableOpacity, LoadingIndicator } from '../core-ui';
import { GET_BRANDS } from '../graphql/queries/server/brand';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';
import { WHITE, THEME_COLOR } from '../constants/colors';
import useGoogleMaps from '../utils/useGoogleMaps';
import SvgPlus from '../components/icons/plus';
import { GetBrands } from '../generated/GetBrands';
import { MAP_DEFAULT_CENTER } from '../constants/googleMaps';

export default () => {
  let { data, loading } = useQuery<GetBrands>(GET_BRANDS);
  let history = useHistory();
  let { isLoading: googleLoading } = useGoogleMaps();
  return (
    <View flex>
      {loading || googleLoading ? (
        <LoadingIndicator />
      ) : (
        data &&
        data.brands.map((brandData, index) => {
          let { name, categories, matchingLocations, id } = brandData;
          let heatmapData = ((matchingLocations
            ? matchingLocations.map(({ lat, lng, match }) => {
                return {
                  location: new google.maps.LatLng(lat, lng),
                  weight: match,
                };
              })
            : []) as unknown) as google.maps.MVCArray<google.maps.visualization.WeightedLocation>;
          return (
            <TouchableOpacity key={index} style={{ marginBottom: 24 }}>
              <HistoryContainer>
                <LeftContainer
                  flex
                  onClick={() => {
                    history.push(`/user/brands/${id}`, {
                      ...brandData,
                    });
                  }}
                >
                  <RowedView>
                    <Text>Brand Name</Text>
                    <Text>{name}</Text>
                  </RowedView>
                  <RowedView>
                    <Text>Categories</Text>
                    <PillContainer>
                      {categories &&
                        categories.map((category, idx) => (
                          <Pill disabled key={index + '_' + idx} primary>
                            {category}
                          </Pill>
                        ))}
                    </PillContainer>
                  </RowedView>
                </LeftContainer>
                <HeatmapPlaceholder heatmapData={heatmapData} brandId={id} />
              </HistoryContainer>
            </TouchableOpacity>
          );
        })
      )}
      <AddButton
        onPress={() => {
          history.push('/');
        }}
      >
        <SvgPlus style={{ marginRight: 8, color: THEME_COLOR }} />
        <Text color={THEME_COLOR}>New Retailer or Restaurant</Text>
      </AddButton>
    </View>
  );
};
type HeatmapProps = {
  heatmapData: google.maps.MVCArray<google.maps.visualization.WeightedLocation>;
  brandId?: string;
};

let GoogleHeatmap = withGoogleMap((props: HeatmapProps) => {
  return (
    <GoogleMap
      defaultZoom={9}
      defaultCenter={MAP_DEFAULT_CENTER}
      defaultClickableIcons={false}
      defaultOptions={{
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: false,
        draggable: false,
      }}
    >
      <HeatMapLayer
        data={props.heatmapData}
        options={{ data: props.heatmapData, radius: 0.01, opacity: 1, dissipating: false }}
      />
    </GoogleMap>
  );
});

function HeatmapPlaceholder(props: HeatmapProps) {
  let { heatmapData, brandId } = props;
  let { isLoading } = useGoogleMaps();
  let history = useHistory();
  return isLoading ? null : (
    <GoogleHeatmap
      containerElement={
        <TouchableOpacity
          style={{ width: 200 }}
          onPress={() => {
            history.push(`/map/${brandId}`);
          }}
        />
      }
      mapElement={<View flex />}
      heatmapData={heatmapData}
    />
  );
}

const HistoryContainer = styled(Card)`
  flex-direction: row;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin: 6px 0;
`;

const PillContainer = styled(View)`
  flex-direction: row;
`;

const Pill = styled(PillButton)`
  margin-left: 8px;
`;

const LeftContainer = styled(View)`
  padding: 12px 24px;
  height: 150px;
`;

const AddButton = styled(TouchableOpacity)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  background-color: ${WHITE};
  overflow: hidden;
  background-color: ${WHITE};
  justify-content: center;
  align-items: center;
  height: 48px;
  flex-direction: row;
`;
