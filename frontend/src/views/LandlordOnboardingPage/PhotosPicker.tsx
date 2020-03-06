import React from 'react';
import styled from 'styled-components';

import { View, Label, TouchableOpacity, Dropzone } from '../../core-ui';
import { FileWithPreview } from '../../core-ui/Dropzone';

type Props = {
  mainPhoto: string | FileWithPreview | null;
  onMainPhotoChange: (withPreview: FileWithPreview | null | string) => void;
  additionalPhotos: Array<string | FileWithPreview | null>;
  onAdditionalPhotoChange: (withPreviews: Array<string | FileWithPreview | null>) => void;
};

export default function PhotosPicker(props: Props) {
  let { mainPhoto, onMainPhotoChange, additionalPhotos, onAdditionalPhotoChange } = props;

  let onPhotoRemove = (index: number) => {
    if (index === 0) {
      onMainPhotoChange(null);
    } else {
      let newPhotoList = additionalPhotos.map((item, i) => {
        if (i + 1 === index) {
          return null;
        } else {
          return item;
        }
      });
      onAdditionalPhotoChange(newPhotoList);
    }
  };

  let onAdditionalPhotosChange = (file: FileWithPreview, index: number) => {
    let newList = additionalPhotos.map((item, idx) => {
      if (index === idx) {
        return file;
      }
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
      />
      <LabelText text="Additional Property Photos" />
      <PhotosContainer flex>
        {Array.from({ length: 4 }).map((_, index) => {
          let image = additionalPhotos[index];
          return (
            <PhotoWrapper key={index}>
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

const LabelText = styled(Label)`
  margin: 12px 0 8px 0;
`;

const PhotosContainer = styled(View)`
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
`;

const PhotoWrapper = styled(TouchableOpacity)`
  width: 24%;
`;
