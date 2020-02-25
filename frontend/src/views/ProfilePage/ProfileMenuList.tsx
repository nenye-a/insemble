import React, { ComponentProps, ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { useHistory } from 'react-router-dom';

import { TouchableOpacity, Text, View } from '../../core-ui';
import { THEME_COLOR, WHITE } from '../../constants/colors';
import { DEFAULT_BORDER_RADIUS } from '../../constants/theme';
import SvgPerson from '../../components/icons/person';
import SvgBusiness from '../../components/icons/business';
import SvgMessage from '../../components/icons/message';
import SvgBilling from '../../components/icons/billing';
import { Role } from '../../types/types';

type Props = {
  role: Role;
};

type MenuListProps = ComponentProps<typeof TouchableOpacity> & {
  selected: boolean;
};

export type Menu =
  | 'Profile'
  | 'My Brands'
  | 'Messages'
  | 'Saved Properties'
  | 'Properties'
  | 'Billing & Plans';

export default function ProfileMenuList(props: Props) {
  let history = useHistory();
  let { role } = props;
  let MENUS = role === Role.TENANT ? TENANT_PROFILE_MENU : LANDLORD_PROFILE_MENU;
  return (
    <Container>
      {MENUS.map(({ menu, icon, path }, index) => {
        let isSelected = history.location.pathname.includes(path);
        return (
          <MenuList
            key={index}
            selected={isSelected}
            href={path}
            onPress={() => {
              history.push(path, {
                role,
              });
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
    menu: 'My Brands',
    icon: <SvgBusiness />,
    path: '/user/brands',
  },
  // Disabling this for now until landlord is ready
  // {
  //   menu: 'Messages',
  //   icon: <SvgMessage />,
  //   path: '/user/messages',
  // },
  // {
  //   menu: 'Saved Properties',
  //   icon: <SvgFullHeart />,
  //   path: '/user/saved-properties',
  // },
];

const LANDLORD_PROFILE_MENU: Array<MenuObj> = [
  {
    menu: 'Profile',
    icon: <SvgPerson />,
    path: '/landlord/edit-profile',
  },
  {
    menu: 'Properties',
    icon: <SvgBusiness />,
    path: '/landlord/properties',
  },
  {
    menu: 'Messages',
    icon: <SvgMessage />,
    path: '/landlord/messages',
  },
  {
    menu: 'Billing & Plans',
    icon: <SvgBilling />,
    path: '/landlord/billing',
  },
];
