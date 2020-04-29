import React, { ComponentProps } from 'react';
import styled, { css } from 'styled-components';

import { View, Avatar, Text, TouchableOpacity } from '../../core-ui';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_MEDIUM, DEFAULT_BORDER_RADIUS } from '../../constants/theme';
import { THEME_COLOR, BACKGROUND_COLOR, WHITE } from '../../constants/colors';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';
import SvgInfoFilled from '../../components/icons/info-filled';
import { useCredentials } from '../../utils';
import { Role } from '../../types/types';
import SvgReply from '../../components/icons/reply';
import { Conversations_conversations as ConversationMessages } from '../../generated/Conversations';
import { Popover } from '../../components';
import { LandlordPopover, TenantPopover } from '../../components/message';

type Props = {
  isEven: boolean;
  onPress: () => void;
  conversation: ConversationMessages;
};

type ContainerProps = ComponentProps<typeof TouchableOpacity> & {
  isEven: boolean;
};

export default function MessageCard(props: Props) {
  let { isEven, conversation, onPress } = props;
  let {
    tenant: { avatar },
    property: {
      name: propertyName,
      location: { address },
      space: propertySpace,
    },
    brand: { categories: brandCategories },
    space,
    messages,
    header,
    matchScore,
  } = conversation;
  let { mainPhoto } = space;
  let lastMessage = messages.length - 1;
  let { role } = useCredentials();

  return (
    <Root isEven={isEven}>
      <Container flex onPress={onPress}>
        <Avatar size="medium" image={avatar} />
        <MessageContent flex>
          <Text fontSize={FONT_SIZE_MEDIUM} color={THEME_COLOR}>
            {propertyName}
          </Text>
          <Text fontWeight={FONT_WEIGHT_MEDIUM}>{header}</Text>
          <MessageText>{messages[lastMessage].message}</MessageText>
        </MessageContent>
      </Container>
      <View>
        {role === Role.TENANT ? (
          <>
            <Image src={mainPhoto || imgPlaceholder} />
            <PopoverContainer>
              <Popover
                button={
                  <IconContainer>
                    <SvgInfoFilled style={{ color: WHITE }} />
                  </IconContainer>
                }
              >
                <TenantPopover
                  mainPhoto={mainPhoto}
                  address={address}
                  propertySpace={propertySpace}
                  matchScore={matchScore}
                />
              </Popover>
            </PopoverContainer>
          </>
        ) : (
          <Row>
            <TouchableOpacity onPress={onPress}>
              <SvgReply />
            </TouchableOpacity>
            <Popover button={<SvgInfoFilled style={{ color: THEME_COLOR, marginLeft: 10 }} />}>
              <LandlordPopover matchScore={matchScore} brandCategories={brandCategories} />
            </Popover>
          </Row>
        )}
      </View>
    </Root>
  );
}

const Root = styled(View)<ContainerProps>`
  flex-direction: row;
  padding: 16px 24px;
  justify-content: space-between;
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
  height: 90px;
`;

const MessageText = styled(Text)`
  height: 3em; // 2 lines * line-height
  overflow: hidden;
`;

const PopoverContainer = styled(View)`
  position: absolute;
  right: 6px;
  top: 6px;
`;

const IconContainer = styled(TouchableOpacity)`
  position: absolute;
  right: 6px;
  top: 6px;
`;

const Container = styled(TouchableOpacity)`
  flex-direction: row;
`;
