import React, { ComponentProps } from 'react';
import styled from 'styled-components';

import { Card, Text, View } from '../../core-ui';
import { FONT_WEIGHT_MEDIUM } from '../../constants/theme';

type CardProps = ComponentProps<typeof Card>;
type Props = CardProps & {
  priceSqft: string;
  type: string;
  condition: string;
  sqft: string;
  tenacy: string;
};

export default function SummaryCard({
  priceSqft,
  type,
  condition,
  sqft,
  tenacy,
  ...otherProps
}: Props) {
  return (
    <Card title="Summary" titleBackground="purple" {...otherProps}>
      <ContentContainer>
        <RowedView>
          <View flex>
            <DescriptionItem>
              <Text>Price/sqft:</Text>
              <Text fontWeight={FONT_WEIGHT_MEDIUM}>{priceSqft}/year</Text>
            </DescriptionItem>
            <DescriptionItem>
              <Text>Type:</Text>
              <Text fontWeight={FONT_WEIGHT_MEDIUM} style={{ textAlign: 'right' }}>
                {type}
              </Text>
            </DescriptionItem>
            <DescriptionItem>
              <Text>Condition:</Text>
              <Text fontWeight={FONT_WEIGHT_MEDIUM}>{condition}</Text>
            </DescriptionItem>
          </View>
          <Spacing />
          <View flex>
            <DescriptionItem>
              <Text>Sqft:</Text>
              <Text fontWeight={FONT_WEIGHT_MEDIUM}>{sqft}</Text>
            </DescriptionItem>
            <DescriptionItem>
              <Text>Tenacy:</Text>
              <Text fontWeight={FONT_WEIGHT_MEDIUM}>{tenacy}</Text>
            </DescriptionItem>
          </View>
        </RowedView>
      </ContentContainer>
    </Card>
  );
}

const ContentContainer = styled(View)`
  padding: 12px;
`;

const RowedView = styled(View)`
  flex-direction: row;
`;

const DescriptionItem = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  line-height: 2;
`;

const Spacing = styled(View)`
  width: 12px;
`;
