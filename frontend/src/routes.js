// Layout Types
import { BasicLayout, UserProfileLayout, BlankLayout, LandlordProfileLayout } from './layouts';

// Route Views
import Login from './views/Login';
import Landing from './views/Landing';
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
import TenantEmailVerification from './views/TenantEmailVerification';
import VerificationSuccessful from './views/VerificationSuccessful';
import LandlordProperties from './views/LandlordProperties';
import LandlordPropertyDetails from './views/LandlordPropertyDetails';

import { tenantAuthorization } from './utils';

export default [
  {
    path: '/',
    exact: true,
    layout: BlankLayout,
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
    path: '/landlord/edit-profile',
    layout: LandlordProfileLayout,
    component: EditBasicProfile,
  },
  {
    path: '/landlord/properties',
    layout: LandlordProfileLayout,
    exact: true,
    component: LandlordProperties,
  },
  {
    path: '/landlord/property-detail/:brandId',
    layout: LandlordProfileLayout,
    component: LandlordPropertyDetails,
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
  {
    path: '/email-verification/:verificationId',
    layout: BasicLayout,
    component: TenantEmailVerification,
  },
  {
    path: '/verification-successful',
    layout: BasicLayout,
    component: VerificationSuccessful,
  },
];
