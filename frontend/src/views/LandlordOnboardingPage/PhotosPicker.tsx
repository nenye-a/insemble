import React, { ComponentProps } from 'react';
import styled, { css } from 'styled-components';

import { View, Label, TouchableOpacity, Dropzone } from '../../core-ui';
import { FileWithPreview } from '../../core-ui/Dropzone';
import { useViewport } from '../../utils';
import { RED_TEXT } from '../../constants/colors';

type Props = {
  mainPhoto: string | FileWithPreview | null;
  onMainPhotoChange: (withPreview: FileWithPreview | null | string) => void;
  additionalPhotos: Array<string | FileWithPreview | null>;
  onAdditionalPhotoChange: (withPreviews: Array<string | FileWithPreview | null>) => void;
};

export default function PhotosPicker(props: Props) {
  let { mainPhoto, onMainPhotoChange, additionalPhotos, onAdditionalPhotoChange } = props;
  let { isDesktop } = useViewport();

  let onMainPhotoRemove = () => {
    onMainPhotoChange(null);
  };

  let onAdditionalPhotosRemove = (index: number) => {
    let filteredPhotos = additionalPhotos.filter((item, idx) => idx !== index);
    onAdditionalPhotoChange(filteredPhotos);
  };

  let onAdditionalPhotosChange = (file: FileWithPreview, index: number) => {
    if (index < 20) {
      let newList = [...additionalPhotos, file];
      onAdditionalPhotoChange(newList);
    }
  };

  return (
    <View>
      <Row>
        <LabelText text="Temporary Main Photo" />
        <LabelText text="*required" color={RED_TEXT} style={{ marginLeft: 8 }} />
      </Row>
      <Dropzone
        source={typeof mainPhoto === 'string' ? mainPhoto : mainPhoto?.preview}
        getPreview={onMainPhotoChange}
        onPhotoRemove={onMainPhotoRemove}
        isMainPhoto={true}
      />
      <Row>
        <LabelText text="Additional Property Photos" />
        <LabelText text="*required" color={RED_TEXT} style={{ marginLeft: 8 }} />
      </Row>
      <PhotosContainer flex>
        {additionalPhotos.map((_, index) => {
          let image = additionalPhotos[index];
          return (
            <PhotoWrapper isDesktop={isDesktop} key={index}>
              <Dropzone
                source={typeof image === 'string' ? image : image?.preview}
                getPreview={(file) => onAdditionalPhotosChange(file, index)}
                onPhotoRemove={() => {
                  onAdditionalPhotosRemove(index);
                }}
              />
            </PhotoWrapper>
          );
        })}
        <PhotoWrapper isDesktop={isDesktop}>
          <Dropzone
            source=""
            getPreview={(file) => onAdditionalPhotosChange(file, additionalPhotos.length)}
          />
        </PhotoWrapper>
      </PhotosContainer>
    </View>
  );
}

type PhotoWrapperProps = ComponentProps<typeof TouchableOpacity> & {
  isDesktop: boolean;
};

const LabelText = styled(Label)`
  margin: 12px 0 8px 0;
`;

const PhotosContainer = styled(View)`
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  overflow-y: scroll;
  max-height: 200px;
`;

const PhotoWrapper = styled(TouchableOpacity)<PhotoWrapperProps>`
  ${(props) =>
    props.isDesktop
      ? css`
          width: 24%;
          margin-right: 6px;
          margin-bottom: 6px;
        `
      : css`
          // so there is still 1% margin between each photo
          width: 49%;
          margin: 4px 0;
        `}
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
`;
