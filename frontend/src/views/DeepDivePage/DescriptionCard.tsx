import React, { ComponentProps } from 'react';
import styled from 'styled-components';

import { Card, Text } from '../../core-ui';

type CardProps = ComponentProps<typeof Card>;
type Props = CardProps & {
  content: string;
};

export default function DescriptionCard({ content }: Props) {
  return (
    <Card title="Description" titleBackground="purple">
      <Content>{content}</Content>
    </Card>
  );
}

const Content = styled(Text)`
  padding: 12px;
`;
