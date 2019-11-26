import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, HeaderNavigation, IconSidebar, LandlordLayout, TenantSpaces, Tenant, LoginLayout } from "./layouts";

// Route Views
import Analytics from "./views/Analytics";
import Insights from "./views/Insights";
import Spaces from "./views/Spaces";
import BlogOverview from "./views/BlogOverview";
import UserProfile from "./views/UserProfile";
import UserProfileLite from "./views/UserProfileLite";
import EditUserProfile from "./views/EditUserProfile";
import DescribeStore from "./views/DescribeStore";
import Login from "./views/Login";
import Landing from "./views/Landing";
import Existing from "./views/Existing";
import Verify from "./views/Verify";
import Find from "./views/Find";
import Register from "./views/Register";
import ForgotPassword from "./views/ForgotPassword";
import ChangePassword from "./views/ChangePassword";
import FileManagerList from "./views/FileManagerList";
import Explore from "./views/Explore";
import TenantDeepDive from "./views/TenantDeepDive";
import LocationDeepDive from "./views/LocationDeepDive";
import LocationDeepDiveDemo from "./views/LocationDeepDiveDemo";
import Matches from "./views/Matches";
import TransactionHistory from "./views/TransactionHistory";
import Calendar from "./views/Calendar";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import NoDeals from "./views/NoDeals";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";
import HeaderNav from "./views/HeaderNavigation";
import IconSidebarView from "./views/IconSidebar";

const BlankIconSidebarLayout = ({ children }) => (
  <IconSidebar noNavbar noFooter>
    {children}
  </IconSidebar>
);

export default [
  {
    path: "/",
    exact: true,
    layout: LoginLayout,
    // component: () => <Redirect to="/start" />
    component: Landing
  },
  {
    path: "/insights",
    layout: DefaultLayout,
    component: Insights
  },
  {
    path: "/landlord",
    layout: LandlordLayout,
    component: Insights
  },
  {
    path: "/analytics",
    layout: DefaultLayout,
    component: Analytics
  },
  {
    path: "/spaces",
    layout: Tenant,
    component: Spaces
  },
  {
    path: "/blog-overview",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/user-profile",
    layout: DefaultLayout,
    component: UserProfile
  },
  {
    path: "/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/edit-user-profile",
    layout: DefaultLayout,
    component: EditUserProfile
  },
  {
    path: "/describe-store",
    layout: LoginLayout,
    component: DescribeStore
  },
  {
    path: "/login",
    layout: LoginLayout,
    component: Login
  },
  {
    path: "/find",
    layout: LoginLayout,
    component: Find
  },
  {
    path: "/existing",
    layout: LoginLayout,
    component: Existing
  },
  {
    path: "/verify",
    layout: LoginLayout,
    component: Verify
  },
  {
    path: "/register",
    layout: BlankIconSidebarLayout,
    component: Register
  },
  {
    path: "/forgot-password",
    layout: BlankIconSidebarLayout,
    component: ForgotPassword
  },
  {
    path: "/change-password",
    layout: BlankIconSidebarLayout,
    component: ChangePassword
  },
  {
    path: "/file-manager-list",
    layout: DefaultLayout,
    component: FileManagerList
  },
  {
    path: "/explore",
    layout: LandlordLayout,
    component: Explore
  },
  {
    path: "/tenant-deep-dive",
    layout: HeaderNavigation,
    component: TenantDeepDive
  },
  {
    path: "/location-deep-dive-demo",
    layout: Tenant,
    component: LocationDeepDiveDemo
  },
  {
    path: "/matches",
    layout: LandlordLayout,
    component: Matches
  },
  {
    path: "/transaction-history",
    layout: DefaultLayout,
    component: TransactionHistory
  },
  {
    path: "/calendar",
    layout: DefaultLayout,
    component: Calendar
  },
  {
    path: "/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/errors",
    layout: BlankIconSidebarLayout,
    component: Errors
  },
  {
    path: "/no-deals",
    layout: LandlordLayout,
    component: NoDeals
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/tables",
    layout: DefaultLayout,
    component: Tables
  },
  {
    path: "/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  },
  {
    path: "/header-navigation",
    layout: HeaderNavigation,
    component: HeaderNav
  },
  {
    path: "/icon-sidebar-nav",
    layout: IconSidebar,
    component: IconSidebarView
  }
];
