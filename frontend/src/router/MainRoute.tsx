import React from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import Routes, { RouteType } from './routes';
import withTracker from '../withTracker';
import UpgradeConfirmationModal from '../views/TenantPlan/UpgradeConfirmationModal';

export default function MainRoute() {
  let location = useLocation();
  let background = location.state && location.state.background;

  return (
    <>
      <Switch location={background || location}>
        {Routes.map((route: RouteType, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={withTracker((props: RouteType) => {
                if (route?.authorization?.isAuthorized && !route.authorization.isAuthorized()) {
                  return (
                    <Redirect
                      to={{
                        pathname: '/',
                      }}
                    />
                  );
                }
                let Component = route.component;
                let Layout = route.layout;
                return (
                  <Layout {...props} {...route?.props}>
                    <Component {...props} />
                  </Layout>
                );
              })}
            />
          );
        })}
      </Switch>
      {background && (
        <Route exact={true} path="/user/upgrade-plan/:step" component={UpgradeConfirmationModal} />
      )}
    </>
  );
}
