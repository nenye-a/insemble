import React from 'react';
import styled from 'styled-components';
import ReactDropzone, { DropzoneProps } from 'react-dropzone';

import View from './View';
import LoadingIndicator from './LoadingIndicator';
import TouchableOpacity from './TouchableOpacity';
import placeholder from '../assets/images/image-placeholder.jpg';
import SvgCircleClose from '../components/icons/circle-close';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';

export type FileWithPreview = { file: File; preview: string };

type Props = DropzoneProps & {
  source?: string;
  getPreview?: (withPreview: FileWithPreview) => void;
  loading?: boolean;
  onPhotoRemove?: () => void;
  showCloseIcon?: boolean;
};

export default function Dropzone(props: Props) {
  let {
    source,
    getPreview,
    loading,
    onPhotoRemove,
    showCloseIcon = true,
    ...dropzoneProps
  } = props;

  return (
    <View>
      <ReactDropzone
        accept="image/*"
        multiple={false}
        preventDropOnDocument
        onDrop={(acceptedFiles) => {
          let files = acceptedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
          }));
          getPreview && getPreview(files[0]);
        }}
        {...dropzoneProps}
      >
        {({ getRootProps, getInputProps }) => {
          let content;
          if (loading) {
            content = <LoadingIndicator />;
          } else if (source) {
            content = <Image src={source} />;
          } else {
            content = <Placeholder src={placeholder} />;
          }
          return (
            <View {...getRootProps()}>
              <input {...getInputProps()} />
              {content}
            </View>
          );
        }}
      </ReactDropzone>
      {showCloseIcon && source && (
        <CloseButtonWrapper onPress={() => onPhotoRemove && onPhotoRemove()}>
          <SvgCircleClose />
        </CloseButtonWrapper>
      )}
    </View>
  );
}

const Placeholder = styled.img`
  height: 160px;
  object-fit: cover;
  border: 1px solid white;
  border-radius: ${DEFAULT_BORDER_RADIUS};
  width: 100%;
`;

const Image = styled.img`
  object-fit: cover;
  border: 1px solid white;
  border-radius: ${DEFAULT_BORDER_RADIUS};
  height: 160px;
`;

const CloseButtonWrapper = styled(TouchableOpacity)`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
`;
