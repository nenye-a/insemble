import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { View, Text, Card, Avatar, Button } from '../core-ui';
import { THEME_COLOR, BACKGROUND_COLOR } from '../constants/colors';
import { FONT_WEIGHT_BOLD, FONT_SIZE_LARGE, FONT_WEIGHT_MEDIUM } from '../constants/theme';
import { MESSAGE_DETAIL } from '../fixtures/dummyData';
import imgPlaceholder from '../assets/images/image-placeholder.jpg';
import SvgArrowBack from '../components/icons/arrow-back';
import SvgInfoFilled from '../components/icons/info-filled';

export default function MessageDetail() {
  let history = useHistory();
  let {
    photo,
    address,
    matchPercentage,
    landlordAvatar,
    landlordMessage,
    tenantSubject,
    tenantMessage,
    numberOfSpace,
  } = MESSAGE_DETAIL;
  return (
    <Container flex>
      <NavigationContainer>
        <Button
          mode="transparent"
          text="Back to Messages"
          icon={<SvgArrowBack style={{ color: THEME_COLOR }} />}
          onPress={() => history.push('/user/messages')}
          textProps={{ style: { marginLeft: 12 } }}
        />
        <SvgInfoFilled style={{ color: THEME_COLOR }} />
      </NavigationContainer>
      <Image src={photo || imgPlaceholder} />
      <HeaderContainer>
        <View>
          <Text color={THEME_COLOR} fontWeight={FONT_WEIGHT_BOLD} fontSize={FONT_SIZE_LARGE}>
            {address}
          </Text>
          <Text color={THEME_COLOR}>{numberOfSpace} space(s)</Text>
        </View>
        <Text color={THEME_COLOR} fontWeight={FONT_WEIGHT_MEDIUM} fontSize={FONT_SIZE_LARGE}>
          {matchPercentage}% Match
        </Text>
      </HeaderContainer>
      <RowedView>
        <AvatarContainer>
          <Avatar size="medium" image={landlordAvatar} />
        </AvatarContainer>
        <View flex>
          <View style={{ paddingRight: 24 }}>
            <Text fontWeight={FONT_WEIGHT_MEDIUM}>{tenantSubject}</Text>
            <Text>{tenantMessage}</Text>
          </View>
          <RepliedMessage>
            <Text>{landlordMessage}</Text>
          </RepliedMessage>
        </View>
      </RowedView>
    </Container>
  );
}

const Container = styled(Card)`
  // padding: 12px 0;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 24px;
`;

const NavigationContainer = styled(RowedView)`
  padding: 12px 24px 12px 12px;
  align-items: center;
`;

const Image = styled.img`
  height: 160px;
  object-fit: cover;
`;

const AvatarContainer = styled(View)`
  padding: 0 24px;
`;

const RepliedMessage = styled(View)`
  padding: 16px 18px;
  border-left: ${THEME_COLOR} 2px solid;
  background-color: ${BACKGROUND_COLOR};
  margin-top: 12px;
`;
