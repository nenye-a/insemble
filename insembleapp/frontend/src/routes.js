import React from 'react';
import { Redirect } from 'react-router-dom';

// Layout Types
import {
  HeaderNavigation,
  IconSidebar,
  LandlordLayout,
  Tenant,
  LoginLayout,
  BlankLayout,
  BasicLayout,
} from './layouts';

// Route Views
import Spaces from './views/Spaces';
import DescribeStore from './views/DescribeStore';
import Login from './views/Login';
import Landing from './views/Landing';
import Existing from './views/Existing';
import Feedback from './views/Feedback';
import Explain from './views/Explain';
import Verify from './views/Verify';
import Find from './views/Find';
import Register from './views/Register';
import ForgotPassword from './views/ForgotPassword';
import ChangePassword from './views/ChangePassword';
import Explore from './views/Explore';
import TenantDeepDive from './views/TenantDeepDive';
import LocationDeepDive from './views/LocationDeepDive';
import Matches from './views/Matches';
import Errors from './views/Errors';
import NoDeals from './views/NoDeals';

const BlankIconSidebarLayout = ({ children }) => (
  <IconSidebar noNavbar noFooter>
    {children}
  </IconSidebar>
);

export default [
  {
    path: '/',
    exact: true,
    layout: LoginLayout,
    // component: () => <Redirect to="/start" />
    component: Landing,
  },
  {
    path: '/spaces',
    layout: Tenant,
    component: Spaces,
  },
  {
    path: '/describe-store',
    layout: BlankLayout,
    component: DescribeStore,
  },
  {
    path: '/login',
    layout: LoginLayout,
    component: Login,
  },
  {
    path: '/find',
    layout: BlankLayout,
    component: Find,
  },
  {
    path: '/existing',
    layout: BlankLayout,
    component: Existing,
  },
  {
    path: '/feedback',
    layout: LoginLayout,
    component: Feedback,
  },
  {
    path: '/explain',
    layout: LoginLayout,
    component: Explain,
  },
  {
    path: '/verify',
    layout: BasicLayout,
    component: Verify,
  },
  {
    path: '/register',
    layout: LoginLayout,
    component: Register,
  },
  {
    path: '/forgot-password',
    layout: LoginLayout,
    component: ForgotPassword,
  },
  {
    path: '/change-password',
    layout: BlankIconSidebarLayout,
    component: ChangePassword,
  },
  {
    path: '/explore',
    layout: LandlordLayout,
    component: Explore,
  },
  {
    path: '/location-deep-dive',
    layout: Tenant,
    component: LocationDeepDive,
  },
  {
    path: '/matches',
    layout: LandlordLayout,
    component: Matches,
  },
  {
    path: '/errors',
    layout: BlankIconSidebarLayout,
    component: Errors,
  },
  {
    path: '/no-deals',
    layout: LandlordLayout,
    component: NoDeals,
  },
  {
    path: '/tenant-deep-dive',
    layout: HeaderNavigation,
    component: TenantDeepDive,
  },
];
