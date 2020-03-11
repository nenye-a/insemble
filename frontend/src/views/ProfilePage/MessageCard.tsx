import React, { ComponentProps } from 'react';
import styled, { css } from 'styled-components';

import { View, Avatar, Text, TouchableOpacity } from '../../core-ui';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_MEDIUM, DEFAULT_BORDER_RADIUS } from '../../constants/theme';
import { THEME_COLOR, BACKGROUND_COLOR, WHITE } from '../../constants/colors';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';
import SvgInfoFilled from '../../components/icons/info-filled';
import { asyncStorage } from '../../utils';
import { Role } from '../../types/types';
import SvgReply from '../../components/icons/reply';

type Props = {
  isEven: boolean;
  subject: string;
  message: string;
  avatar: string;
  address: string;
  photo: string;
  onPress: () => void;
};

type ContainerProps = ComponentProps<typeof TouchableOpacity> & {
  isEven: boolean;
};

export default function MessageCard(props: Props) {
  let { isEven, subject, message, avatar, photo, address, onPress } = props;
  let role = asyncStorage.getRole();
  return (
    <Container isEven={isEven} onPress={onPress}>
      <Avatar size="medium" image={avatar} />
      <MessageContent flex>
        <Text fontSize={FONT_SIZE_MEDIUM} color={THEME_COLOR}>
          {address}
        </Text>
        <Text fontWeight={FONT_WEIGHT_MEDIUM}>{subject}</Text>
        <MessageText>{message}</MessageText>
      </MessageContent>
      <View>
        {role === Role.TENANT ? (
          <>
            <Image src={photo || imgPlaceholder} />
            <IconContainer>
              <SvgInfoFilled style={{ color: WHITE }} />
            </IconContainer>
          </>
        ) : (
          <Row>
            <SvgReply />
            <SvgInfoFilled style={{ color: THEME_COLOR, marginLeft: 10 }} />
          </Row>
        )}
      </View>
    </Container>
  );
}

const Container = styled(TouchableOpacity)<ContainerProps>`
  flex-direction: row;
  padding: 16px 24px;
  ${(props) =>
    props.isEven &&
    css`
      background-color: ${BACKGROUND_COLOR};
    `}
`;

const MessageContent = styled(View)`
  justify-content: space-between;
  padding: 0 12px;
`;

const Row = styled(View)`
  flex-direction: row;
`;

const Image = styled.img`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  object-fit: cover;
  width: 120px;
`;

const MessageText = styled(Text)`
  height: 3em; // 2 lines * line-height
  overflow: hidden;
`;

const IconContainer = styled(TouchableOpacity)`
  position: absolute;
  right: 6px;
  top: 6px;
`;
