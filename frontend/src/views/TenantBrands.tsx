import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
import HeatMapLayer from 'react-google-DELETED_BASE64_STRING';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Popup } from '../components';

import {
  View,
  Card,
  Text,
  PillButton,
  Button,
  TouchableOpacity,
  LoadingIndicator,
  Alert,
} from '../core-ui';
import { GET_BRANDS, DELETE_BRAND } from '../graphql/queries/server/brand';
import {
  DEFAULT_BORDER_RADIUS,
  FONT_SIZE_SMALL,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_LIGHT,
} from '../constants/theme';
import { WHITE, THEME_COLOR } from '../constants/colors';
import useGoogleMaps from '../utils/useGoogleMaps';
import SvgPlus from '../components/icons/plus';
import { GetBrands } from '../generated/GetBrands';
import { MAP_DEFAULT_CENTER } from '../constants/googleMaps';
import SvgCircleClose from '../components/icons/circle-close';
import { DeleteBrand, DeleteBrandVariables } from '../generated/DeleteBrand';

type HeatmapProps = {
  heatmapData: google.maps.MVCArray<google.maps.visualization.WeightedLocation>;
  brandId?: string;
};

export default () => {
  let { data, loading } = useQuery<GetBrands>(GET_BRANDS);
  let [removeConfirmationVisible, setRemoveConfirmationVisible] = useState(false);
  let history = useHistory();
  let [selectedBrandId, setSelectedBrandId] = useState('');
  let { isLoading: googleLoading } = useGoogleMaps();
  let [removeBrand, { error: removeBrandError, loading: removeBrandLoading }] = useMutation<
    DeleteBrand,
    DeleteBrandVariables
  >(DELETE_BRAND);
  let closeDeleteConfirmation = () => {
    setRemoveConfirmationVisible(false);
  };
  let onRemovePress = () => {
    if (selectedBrandId) {
      removeBrand({
        variables: {
          brandId: selectedBrandId,
        },
        refetchQueries: [{ query: GET_BRANDS }],
        awaitRefetchQueries: true,
      });
      setRemoveConfirmationVisible(false);
      setSelectedBrandId('');
    }
  };

  return (
    <View flex>
      <Popup
        visible={removeConfirmationVisible}
        title="Remove Brand"
        bodyText="Are you sure you want to remove this brand?"
        buttons={[
          { text: 'Yes', onPress: onRemovePress },
          { text: 'No', onPress: closeDeleteConfirmation },
        ]}
      />
      <Alert visible={!!removeBrandError} text={removeBrandError?.message || ''} />
      {loading || googleLoading || removeBrandLoading ? (
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
            <View key={index}>
              <TouchableOpacity style={{ marginBottom: 24 }}>
                <HistoryContainer>
                  <LeftContainer
                    flex
                    onClick={() => {
                      history.push(`/map/${id}`);
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
                    <EditButton
                      stopPropagation={true}
                      mode="withShadow"
                      text="Edit Brand"
                      textProps={{ fontSize: FONT_SIZE_SMALL, fontWeight: FONT_WEIGHT_MEDIUM }}
                      onPress={() => {
                        history.push(`/user/brands/${id}`, {
                          ...brandData,
                        });
                      }}
                    />
                  </LeftContainer>
                  <HeatmapPlaceholder heatmapData={heatmapData} brandId={id} />
                </HistoryContainer>
              </TouchableOpacity>
              <RemoveButton
                onPress={() => {
                  setRemoveConfirmationVisible(true);
                  setSelectedBrandId(brandData.id);
                }}
              >
                <SvgCircleClose />
              </RemoveButton>
            </View>
          );
        })
      )}
      <View>
        <AddButton
          onPress={() => {
            history.push('/new-brand');
          }}
        >
          <SvgPlus style={{ marginRight: 8, color: THEME_COLOR }} />
          <AddBrandText color={THEME_COLOR}>New Retailer or Restaurant</AddBrandText>
          <UpgradeButton
            text="Upgrade to Add"
            onPress={() => history.push('/user/plan')}
            stopPropagation={true}
            textProps={{ style: { fontWeight: FONT_WEIGHT_LIGHT } }}
          />
        </AddButton>
      </View>
    </View>
  );
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

const EditButton = styled(Button)`
  width: 85px;
`;
const RemoveButton = styled(TouchableOpacity)`
  position: absolute;
  right: -36px;
  top: 63px;
`;
const UpgradeButton = styled(Button)`
  width: 160px;
`;

const AddBrandText = styled(Text)`
  margin-right: 100px;
`;
