import React, { ComponentProps, ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { useHistory } from 'react-router-dom';

import { TouchableOpacity, Text, View } from '../../core-ui';
import { THEME_COLOR, WHITE } from '../../constants/colors';
import { DEFAULT_BORDER_RADIUS } from '../../constants/theme';
import SvgPerson from '../../components/icons/person';
import SvgBusiness from '../../components/icons/business';
import SvgMessage from '../../components/icons/message';
import SvgFullHeart from '../../components/icons/full-heart';

type Props = {
  role?: 'tenant' | 'landlord';
};

type MenuListProps = ComponentProps<typeof TouchableOpacity> & {
  selected: boolean;
};

export type Menu = 'Profile' | 'Matches' | 'Messages' | 'Saved Properties' | 'Properties';

export default function ProfileMenuList(props: Props) {
  let history = useHistory();
  let { role = 'tenant' } = props;
  let MENUS = role === 'tenant' ? TENANT_PROFILE_MENU : LANDLORD_PROFILE_MENU;
  return (
    <Container>
      {MENUS.map(({ menu, icon, path }, index) => {
        let isSelected = history.location.pathname.includes(path);
        return (
          <MenuList
            key={index}
            selected={isSelected}
            forwardedAs="button"
            onPress={() => {
              history.push(path);
            }}
          >
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
  path: string;
};

const TENANT_PROFILE_MENU: Array<MenuObj> = [
  {
    menu: 'Profile',
    icon: <SvgPerson />,
    path: '/user/edit-profile',
  },
  {
    menu: 'Matches',
    icon: <SvgBusiness />,
    path: '/user/tenant-matches',
  },
  {
    menu: 'Messages',
    icon: <SvgMessage />,
    path: '/user/messages',
  },
  {
    menu: 'Saved Properties',
    icon: <SvgFullHeart />,
    path: '/user/saved-properties',
  },
];

const LANDLORD_PROFILE_MENU: Array<MenuObj> = [
  {
    menu: 'Profile',
    icon: <SvgPerson />,
    path: '/',
  },
  {
    menu: 'Properties',
    icon: <SvgBusiness />,
    path: '/',
  },
  {
    menu: 'Messages',
    icon: <SvgMessage />,
    path: '/',
  },
];
