import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';
import BasePopover from '@material-ui/core/Popover';

import { View } from '../core-ui';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';

type Props = {
  button: ReactNode;
  children: ReactNode;
};

export default function Popover(props: Props) {
  let [anchor, setAnchor] = useState<Element | null>(null);
  let open = Boolean(anchor);
  let { children, button } = props;
  return (
    <>
      <ButtonView
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          setAnchor(e.currentTarget);
        }}
      >
        {button}
      </ButtonView>
      <BasePopover
        id="simple-popper"
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <PopoverContainer>{children}</PopoverContainer>
      </BasePopover>
    </>
  );
}

const PopoverContainer = styled(View)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
`;

const ButtonView = styled(View)`
  cursor: pointer;
`;
