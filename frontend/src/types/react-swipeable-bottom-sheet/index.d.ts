declare module 'react-swipeable-bottom-sheet' {
  import { Component, CSSProperties } from 'react';

  export interface SwipeableBottomSheetProps {
    overflowHeight: number;
    open?: boolean;
    style?: CSSProperties;
    bodyStyle?: CSSProperties;
    overlayStyle?: CSSProperties;
    shadowTip?: boolean;
    overlay?: boolean;
    onChange?: (visible: boolean) => void;
  }

  export default class SwipeableBottomSheet extends Component<SwipeableBottomSheetProps> {}
}
