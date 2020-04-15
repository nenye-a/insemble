import React, { ComponentProps } from 'react';
import styled, { css } from 'styled-components';

import { View, Label, TouchableOpacity, Dropzone } from '../../core-ui';
import { FileWithPreview } from '../../core-ui/Dropzone';
import { useViewport } from '../../utils';

type Props = {
  mainPhoto: string | FileWithPreview | null;
  onMainPhotoChange: (withPreview: FileWithPreview | null | string) => void;
  additionalPhotos: Array<string | FileWithPreview | null>;
  onAdditionalPhotoChange: (withPreviews: Array<string | FileWithPreview | null>) => void;
};

export default function PhotosPicker(props: Props) {
  let { mainPhoto, onMainPhotoChange, additionalPhotos, onAdditionalPhotoChange } = props;
  let { isDesktop } = useViewport();
  let onPhotoRemove = (index: number) => {
    if (index === 0) {
      onMainPhotoChange(null);
    } else {
      if (additionalPhotos.length === 20) {
        if (index === 20) {
          additionalPhotos.splice(index - 1, 1, null);
          let newPhotoList = additionalPhotos.map((item) => {
            return item;
          });
          onAdditionalPhotoChange(newPhotoList);
        } else {
          if (additionalPhotos[additionalPhotos.length - 1] == null) {
            additionalPhotos.splice(index - 1, 1);
          } else {
            additionalPhotos.splice(index - 1, 1);
            additionalPhotos.push(null);
          }
          let newPhotoList = additionalPhotos.map((item) => {
            return item;
          });
          onAdditionalPhotoChange(newPhotoList);
        }
      } else {
        additionalPhotos.splice(index - 1, 1);
        let newPhotoList = additionalPhotos.map((item) => {
          return item;
        });
        onAdditionalPhotoChange(newPhotoList);
      }
    }
  };

  let onAdditionalPhotosChange = (file: FileWithPreview, index: number) => {
    if (index < 19) {
      additionalPhotos.unshift(file);
    } else {
      additionalPhotos.splice(index, 1, file);
    }
    let newList = additionalPhotos.map((item) => {
      return item;
    });
    onAdditionalPhotoChange(newList);
  };

  return (
    <View>
      <LabelText text="Temporary Main Photo" />
      <Dropzone
        source={typeof mainPhoto === 'string' ? mainPhoto : mainPhoto?.preview}
        getPreview={onMainPhotoChange}
        onPhotoRemove={() => onPhotoRemove(0)}
        isMainPhoto={true}
      />
      <LabelText text="Additional Property Photos" />
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
