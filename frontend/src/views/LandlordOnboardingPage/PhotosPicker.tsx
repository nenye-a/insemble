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
  let photos = additionalPhotos;
  let onPhotoRemove = (index: number) => {
    if (index === 0) {
      onMainPhotoChange(null);
    } else {
      if (photos.length === 20) {
        if (index === 20) {
          let firstStack = photos.slice(0, index - 1);
          photos = [...firstStack, null];
          onAdditionalPhotoChange(photos);
        } else {
          if (photos[photos.length - 1] == null) {
            let firstStack = photos.slice(0, index - 1);
            let secondStack = photos.slice(index, -1);
            photos = [...firstStack, ...secondStack];
          } else {
            let firstStack = photos.slice(0, index - 1);
            let secondStack = photos.slice(index, -1);
            photos = [...firstStack, ...secondStack, null];
          }
          onAdditionalPhotoChange(photos);
        }
      } else {
        let firstStack = photos.slice(0, index - 1);
        let secondStack = photos.slice(index, -1);
        photos = [...firstStack, ...secondStack];
        onAdditionalPhotoChange(photos);
      }
    }
  };

  let onAdditionalPhotosChange = (file: FileWithPreview, index: number) => {
    if (index < 19) {
      photos.unshift(file);
    } else {
      let firstStack = photos.slice(0, index - 1);
      let secondStack = photos.slice(index, -1);
      photos = [...firstStack, ...secondStack, file];
    }
    let newList = photos.map((item) => {
      return item;
    });
    onAdditionalPhotoChange(newList);
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
        onPhotoRemove={() => onPhotoRemove(0)}
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
            <PhotoWrapper isDesktop={isDesktop} key={index} is>
              <Dropzone
                source={typeof image === 'string' ? image : image?.preview}
                getPreview={(file) => onAdditionalPhotosChange(file, index)}
                onPhotoRemove={() => {
                  onPhotoRemove(index + 1);
                }}
              />
            </PhotoWrapper>
          );
        })}
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
`;

const PhotoWrapper = styled(TouchableOpacity)<PhotoWrapperProps>`
  ${(props) =>
    props.isDesktop
      ? css`
          width: 24%;
          margin-right: 6px;
        `
      : css`
          // so there is still 1% margin between each photo
          width: 49%;
          margin-top: 8px;
        `}
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
`;
