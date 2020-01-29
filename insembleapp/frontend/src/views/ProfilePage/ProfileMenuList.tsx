import React, { ComponentProps, ReactElement } from 'react';
import styled, { css } from 'styled-components';

import { TouchableOpacity, Text, View } from '../../core-ui';
import { THEME_COLOR, WHITE } from '../../constants/colors';
import { DEFAULT_BORDER_RADIUS } from '../../constants/theme';
import SvgPerson from '../../components/icons/person';
import SvgBusiness from '../../components/icons/business';
import SvgMessage from '../../components/icons/message';
import SvgFullHeart from '../../components/icons/full-heart';

type Props = {
  role?: 'tenant' | 'landlord';
  onMenuPress: (selectedMenu: Menu) => void;
  selectedMenu: Menu;
};

type MenuListProps = ComponentProps<typeof TouchableOpacity> & {
  selected: boolean;
};

export type Menu = 'Profile' | 'Matches' | 'Messages' | 'Saved Properties' | 'Properties';

export default function ProfileMenuList(props: Props) {
  let { role = 'tenant', onMenuPress, selectedMenu } = props;
  let MENUS = role === 'tenant' ? TENANT_PROFILE_MENU : LANDLORD_PROFILE_MENU;
  return (
    <Container>
      {MENUS.map(({ menu, icon }, index) => {
        let isSelected = selectedMenu === menu;
        return (
          <MenuList key={index} selected={isSelected} onPress={() => onMenuPress(menu as Menu)}>
            {icon}
            <Text>{menu}</Text>
          </MenuList>
        );
      })}
    </Container>
  );
}

const Container = styled(View)`
  padding: 8px 24px;
`;
const MenuList = styled(TouchableOpacity)<MenuListProps>`
  flex-direction: row;
  height: 36px;
  padding: 0 10px;
  align-items: center;
  border-radius: ${DEFAULT_BORDER_RADIUS};
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0px;
  }
  svg {
    margin-right: 8px;
    color: ${THEME_COLOR};
  }
  ${Text} {
    color: ${THEME_COLOR};
  }
  ${(props) =>
    props.selected &&
    css`
      background-color: ${THEME_COLOR};
      ${Text} {
        color: ${WHITE};
      }
      svg {
        color: ${WHITE};
      }
    `}
`;

type MenuObj = {
  menu: Menu;
  icon: ReactElement;
};

const TENANT_PROFILE_MENU: Array<MenuObj> = [
  {
    menu: 'Profile',
    icon: <SvgPerson />,
  },
  {
    menu: 'Matches',
    icon: <SvgBusiness />,
  },
  {
    menu: 'Messages',
    icon: <SvgMessage />,
  },
  {
    menu: 'Saved Properties',
    icon: <SvgFullHeart />,
  },
];

const LANDLORD_PROFILE_MENU = [
  {
    menu: 'Profile',
    icon: <SvgPerson />,
  },
  {
    menu: 'Properties',
    icon: <SvgBusiness />,
  },
  {
    menu: 'Messages',
    icon: <SvgMessage />,
  },
];
