import { FC } from 'react';

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
import LandlordLogin from './views/LandlordLogin';
import TenantEmailVerification from './views/TenantEmailVerification';
import VerificationSuccessful from './views/VerificationSuccessful';
import LandlordEmailVerification from './views/LandlordEmailVerification';
import LandlordProperties from './views/LandlordProperties';
import LandlordPropertyDetails from './views/LandlordPropertyDetails';
import ForgotPassword from './views/ForgotPassword';
import ForgotPasswordSubmitted from './views/ForgotPasswordSubmitted';
import LandlordMessageDetail from './views/LandlordMessageDetail';
import ResetPasswordTenant from './views/ResetPasswordTenant';
import ResetPasswordLandlord from './views/ResetPasswordLandlord';
import NewBrand from './views/OnboardingPage/NewBrand';

import { tenantAuthorization, landlordAuthorization } from './utils';

export type RouteType = {
  path: string;
  exact?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  layout: FC<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: FC<any>;
  authorization?: {
    redirectPath: string;
    isAuthorized: () => boolean;
  };
  props?: {
    showButton?: boolean;
  };
};

const COMMON_ROUTES = [
  {
    path: '/',
    exact: true,
    layout: BlankLayout,
    component: Landing,
  },
  {
    path: '/verification-successful',
    layout: BasicLayout,
    component: VerificationSuccessful,
  },
  {
    path: '/forgot-password',
    layout: BasicLayout,
    component: ForgotPassword,
  },
  {
    path: '/forgot-password-submitted',
    layout: BasicLayout,
    component: ForgotPasswordSubmitted,
  },
];

const LANDLORD_ROUTES = [
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
    authorization: landlordAuthorization,
  },
  {
    path: '/landlord/properties',
    layout: LandlordProfileLayout,
    exact: true,
    component: LandlordProperties,
    authorization: landlordAuthorization,
  },
  {
    path: '/landlord/properties/:paramsId',
    layout: LandlordProfileLayout,
    component: LandlordPropertyDetails,
    authorization: landlordAuthorization,
  },
  {
    path: '/landlord/email-verification/:verificationId',
    layout: BasicLayout,
    component: LandlordEmailVerification,
  },
  {
    path: '/landlord/new-property/:formStep',
    layout: BasicLayout,
    component: LandlordOnboarding,
    authorization: landlordAuthorization,
  },
  {
    path: '/landlord/new-property/',
    layout: BasicLayout,
    component: LandlordOnboarding,
    exact: true,
    authorization: landlordAuthorization,
  },
  {
    path: '/landlord/messages',
    layout: LandlordProfileLayout,
    component: Messages,
    exact: true,
    authorization: landlordAuthorization,
  },
  {
    path: '/landlord/messages/:conversationId',
    layout: LandlordProfileLayout,
    component: LandlordMessageDetail,
    authorization: landlordAuthorization,
  },
  {
    path: '/reset-password-landlord/:verificationId',
    layout: BasicLayout,
    component: ResetPasswordLandlord,
  },
];

const TENANT_ROUTES = [
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
    path: '/verify/:formStep',
    layout: BasicLayout,
    component: Onboarding,
  },
  {
    path: '/new-brand',
    layout: BasicLayout,
    component: NewBrand,
    authorization: tenantAuthorization,
  },
  {
    path: '/map/:brandId',
    layout: BasicLayout,
    component: MainMap,
    props: {
      showButton: true,
      showBanner: true,
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
  },
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
    path: '/user/messages/:conversationId',
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
    path: '/reset-password-tenant/:verificationId',
    layout: BasicLayout,
    component: ResetPasswordTenant,
  },
];

const ROUTES = [...COMMON_ROUTES, ...LANDLORD_ROUTES, ...TENANT_ROUTES];

export default ROUTES;
