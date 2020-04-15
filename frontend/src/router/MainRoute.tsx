import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Routes, { RouteType } from './routes';
import withTracker from '../withTracker';

export default function MainRoute() {
  return (
    <BrowserRouter>
      <Switch>
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
    </BrowserRouter>
  );
}
