// Layout Types
import { BasicLayout, UserProfileLayout, BlankLayout } from './layouts';

// Route Views
import Spaces from './views/Spaces';
import DescribeStore from './views/DescribeStore';
import Login from './views/Login';
import Landing from './views/Landing';
import Existing from './views/Existing';
import Feedback from './views/Feedback';
import Explain from './views/Explain';
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
import MainMap from './views/MainMap';
import Onboarding from './views/Onboarding';
import TenantSavedProperties from './views/TenantSavedProperties';
import EditBasicProfile from './views/EditBasicProfile';
import TenantBrands from './views/TenantBrands';
import Messages from './views/Messages';
import MessageDetail from './views/MessageDetail';
import BrandDetail from './views/BrandDetail';
import SignUp from './views/SignUp';
import LandlordOnboarding from './views/LandlordOnboarding';
import LandlordSignUp from './views/LandlordSignUp';
import LandlordLogin from './views/LanlordLogin';

import { tenantAuthorization } from './utils';

export default [
  {
    path: '/',
    exact: true,
    layout: BlankLayout,
    // component: () => <Redirect to="/start" />
    component: Landing,
  },
  {
    path: '/landlord/signup',
    exact: true,
    layout: BlankLayout,
    component: LandlordSignUp,
  },
  {
    path: '/landlord/login',
    exact: true,
    layout: BlankLayout,
    component: LandlordLogin,
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
    path: '/signup',
    layout: BasicLayout,
    component: SignUp,
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
    component: Onboarding,
  },
  {
    path: '/landlord/verify',
    exact: true,
    layout: BasicLayout,
    component: LandlordOnboarding,
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
    authorization: tenantAuthorization,
  },
  {
    path: '/explore',
    layout: BasicLayout,
    component: Explore,
    authorization: tenantAuthorization,
  },
  {
    path: '/location-deep-dive',
    layout: BasicLayout,
    component: LocationDeepDive,
    authorization: tenantAuthorization,
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
    authorization: tenantAuthorization,
  },
  {
    path: '/map/:brandId',
    layout: BasicLayout,
    component: MainMap,
    props: {
      showButton: true,
    },
    authorization: tenantAuthorization,
  },
  {
    path: '/user/edit-profile',
    layout: UserProfileLayout,
    component: EditBasicProfile,
    authorization: tenantAuthorization,
  },
  {
    path: '/user/brands',
    layout: UserProfileLayout,
    component: TenantBrands,
    exact: true,
    authorization: tenantAuthorization,
  }, // TODO: change tenant matches to brand
  {
    path: '/user/brands/:brandId',
    layout: UserProfileLayout,
    component: BrandDetail,
    authorization: tenantAuthorization,
  },
  {
    path: '/user/messages',
    layout: UserProfileLayout,
    component: Messages,
    exact: true,
    authorization: tenantAuthorization,
  },
  {
    path: '/user/messages/:messageID',
    layout: UserProfileLayout,
    component: MessageDetail,
    authorization: tenantAuthorization,
  },
  {
    path: '/user/saved-properties',
    layout: UserProfileLayout,
    component: TenantSavedProperties,
    authorization: tenantAuthorization,
  },
];
