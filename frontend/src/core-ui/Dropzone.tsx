import React from 'react';
import styled from 'styled-components';
import ReactDropzone, { DropzoneProps } from 'react-dropzone';

import View from './View';
import LoadingIndicator from './LoadingIndicator';
import TouchableOpacity from './TouchableOpacity';
import placeholder from '../assets/images/image-placeholder.jpg';
import SvgCircleClose from '../components/icons/circle-close';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';
import SvgEdit from '../components/icons/Edit';
import { BORDER_COLOR, WHITE, BUTTON_BORDER_COLOR } from '../constants/colors';

export type FileWithPreview = { file: File; preview: string };

type Props = DropzoneProps & {
  source?: string;
  getPreview?: (withPreview: FileWithPreview) => void;
  loading?: boolean;
  onPhotoRemove?: () => void;
  showCloseIcon?: boolean;
  isMainPhoto?: boolean;
  isAvatar?: boolean;
  editAvatar?: (files: Array<FileWithPreview>) => void;
};

export default function Dropzone(props: Props) {
  let {
    source,
    getPreview,
    loading,
    onPhotoRemove,
    editAvatar,
    showCloseIcon = true,
    isMainPhoto = false,
    isAvatar = false,
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
          if (isAvatar) {
            editAvatar && editAvatar(files);
          } else {
            getPreview && getPreview(files[0]);
          }
        }}
        {...dropzoneProps}
      >
        {({ getRootProps, getInputProps }) => {
          let content;
          if (loading) {
            content = <LoadingIndicator />;
          } else if (source) {
            content = <Image src={source} isMainPhoto={isMainPhoto} />;
          } else if (isAvatar) {
            content = <SvgEdit />;
          } else {
            content = <Image src={placeholder} isMainPhoto={isMainPhoto} />;
          }
          return isAvatar ? (
            <Edit {...getRootProps()}>
              <input {...getInputProps()} />
              {content}
            </Edit>
          ) : (
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
type ImageProps = {
  isMainPhoto: boolean;
};

const Image = styled('img')<ImageProps>`
  height: ${(props) => (props.isMainPhoto === true ? '320px' : '160px')};
  object-fit: cover;
  border: 1px solid ${BORDER_COLOR};
  border-radius: ${DEFAULT_BORDER_RADIUS};
`;

const CloseButtonWrapper = styled(TouchableOpacity)`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
`;
const Edit = styled(View)`
  position: absolute;
  height: 35px;
  width: 35px;
  justify-content: center;
  align-items: center;
  top: -35px;
  right: -60px;
  border-radius: 50%;
  background-color: ${WHITE};
  border: 0.3px solid ${BUTTON_BORDER_COLOR};
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
`;
