import React from 'react';
import styled from 'styled-components';

import { Card, Modal } from '../../core-ui';
import ConfirmPlanUpgrade from '../Billing/ConfirmPlanUpgrade';
import EnterBillingInfo from '../Billing/EnterBillingInfo';
import { DEFAULT_BORDER_RADIUS, FONT_WEIGHT_NORMAL } from '../../constants/theme';
import { PaymentMethodList } from '../../generated/PaymentMethodList';
import UpgradeSuccess from '../Billing/UpgradeSuccess';

type Props = {
  tierName: string;
  price: number;
  isAnnual: boolean;
  visible: boolean;
  planId: string;
  paymentMethodList: PaymentMethodList['paymentMethodList'];
  onClose: () => void;
};
export default function UpgradeConfirmationModal(props: Props) {
  let { tierName, visible, onClose, price, isAnnual, planId, paymentMethodList } = props;
  return (
    <Container visible={visible} hideCloseButton={true} onClose={() => {}}>
      <Card
        titleBackground="purple"
        title="Lets confirm your subscription"
        // TODO: make this default Card styling
        titleProps={{
          style: {
            fontWeight: FONT_WEIGHT_NORMAL,
            textAlign: 'center',
          },
        }}
      >
        {/* <ConfirmPlanUpgrade tierName={tierName} price={price} isAnnual={isAnnual} /> */}
        {/* <EnterBillingInfo /> */}
        <UpgradeSuccess />
      </Card>
    </Container>
  );
}

const Container = styled(Modal)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  width: 750px;
  height: fit-content;
  max-height: 70vh;
`;
