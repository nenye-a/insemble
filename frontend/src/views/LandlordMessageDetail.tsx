import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Text, Card, Avatar, Button, TextArea } from '../core-ui';
import { THEME_COLOR, BACKGROUND_COLOR } from '../constants/colors';
import { FONT_WEIGHT_BOLD, FONT_SIZE_LARGE, FONT_WEIGHT_MEDIUM } from '../constants/theme';
import { MESSAGE_DETAIL } from '../fixtures/dummyData';
import SvgArrowBack from '../components/icons/arrow-back';
import SvgInfoFilled from '../components/icons/info-filled';
import SvgReply from '../components/icons/reply';

export default function LandlordMessageDetail() {
  let history = useHistory();
  let { address, landlordAvatar, tenantSubject, tenantMessage } = MESSAGE_DETAIL;
  let [description, setDescription] = useState('');

  return (
    <Card flex>
      <NavigationContainer>
        <Button
          mode="transparent"
          text="Back to Messages"
          icon={<SvgArrowBack style={{ color: THEME_COLOR, marginLeft: 10 }} />}
          onPress={() => history.push('/user/messages')}
          textProps={{ style: { marginLeft: 12 } }}
        />
        <Row>
          <SvgReply />
          <SvgInfoFilled style={{ color: THEME_COLOR }} />
        </Row>
      </NavigationContainer>
      <HeaderContainer>
        <Text color={THEME_COLOR} fontWeight={FONT_WEIGHT_BOLD} fontSize={FONT_SIZE_LARGE}>
          {address}
        </Text>
      </HeaderContainer>
      <RowedView>
        <View flex />
        <MessageFromTenant style={{ flex: 8 }}>
          <View flex>
            <View style={{ paddingRight: 24 }}>
              <Text fontWeight={FONT_WEIGHT_MEDIUM}>{tenantSubject}</Text>
              <Text>{tenantMessage}</Text>
            </View>
          </View>
          <AvatarContainer>
            <Avatar size="medium" image={landlordAvatar} />
          </AvatarContainer>
        </MessageFromTenant>
      </RowedView>

      <LandlordMessageContainer>
        <LandlordAvatarContainer flex>
          <Avatar size="medium" image={landlordAvatar} />
        </LandlordAvatarContainer>
        <View style={{ flex: 8 }}>
          <TextArea
            label="Description"
            placeholder="Enter Description"
            values={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setDescription(e.target.value);
            }}
            showCharacterLimit
            containerStyle={{ marginTop: 12, marginBottom: 12 }}
          />
          <ButtonContainer>
            <Button text="Send Reply" />
          </ButtonContainer>
        </View>
      </LandlordMessageContainer>
    </Card>
  );
}

const Row = styled(View)`
  flex-direction: row;
`;

const MessageFromTenant = styled(View)`
  padding: 16px 18px;
  border-left: ${THEME_COLOR} 2px solid;
  background-color: ${BACKGROUND_COLOR};
  margin-top: 12px;
  flex-direction: row;
`;

const ButtonContainer = styled(View)`
  justify-content: flex-end;
  flex-direction: row;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0 24px;
`;

const LandlordMessageContainer = styled(RowedView)`
  padding-right: 24px;
`;

const HeaderContainer = styled(View)`
  justify-content: space-between;
  padding: 0 24px;
`;

const NavigationContainer = styled(RowedView)`
  padding: 12px 24px 12px 12px;
  align-items: center;
`;

const AvatarContainer = styled(View)`
  padding: 0 0px;
  justify-content: center;
`;

const LandlordAvatarContainer = styled(AvatarContainer)`
  justify-content: center;
  align-items: center;
`;
