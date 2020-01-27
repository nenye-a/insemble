// Layout Types
import { LoginLayout, BasicLayout } from './layouts';

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
import UserProfile from './views/UserProfile';
import MainMap from './views/MainMap';
import Onboarding from './views/Onboarding';

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
    layout: BasicLayout,
    component: Spaces,
  },
  {
    path: '/describe-store',
    layout: BasicLayout,
    component: DescribeStore,
  },
  {
    path: '/login',
    layout: BasicLayout,
    component: Login,
  },
  {
    path: '/find',
    layout: BasicLayout,
    component: Find,
  },
  {
    path: '/existing',
    layout: BasicLayout,
    component: Existing,
  },
  {
    path: '/feedback',
    layout: BasicLayout,
    component: Feedback,
  },
  {
    path: '/explain',
    layout: BasicLayout,
    component: Explain,
  },
  {
    path: '/verify',
    exact: true,
    layout: BasicLayout,
    component: Onboarding,
  },
  {
    path: '/verify/:placeID',
    layout: BasicLayout,
    component: Verify, // will change this to Onboarding after all scenes are ready
  },
  {
    path: '/register',
    layout: BasicLayout,
    component: Register,
  },
  {
    path: '/forgot-password',
    layout: BasicLayout,
    component: ForgotPassword,
  },
  {
    path: '/change-password',
    layout: BasicLayout,
    component: ChangePassword,
  },
  {
    path: '/explore',
    layout: BasicLayout,
    component: Explore,
  },
  {
    path: '/location-deep-dive',
    layout: BasicLayout,
    component: LocationDeepDive,
  },
  {
    path: '/matches',
    layout: BasicLayout,
    component: Matches,
  },
  {
    path: '/errors',
    layout: BasicLayout,
    component: Errors,
  },
  {
    path: '/no-deals',
    layout: BasicLayout,
    component: NoDeals,
  },
  {
    path: '/tenant-deep-dive',
    layout: BasicLayout,
    component: TenantDeepDive,
  },
  {
    path: '/users/me',
    layout: BasicLayout,
    component: UserProfile,
  },
  { path: '/map', layout: BasicLayout, component: MainMap },
];
