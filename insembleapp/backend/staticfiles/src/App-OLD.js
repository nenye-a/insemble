import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";

import { Provider } from 'react-redux';
import store from './redux/store';
import { loadUser } from './redux/actions/auth'

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/main.scss";

export default () => (
  <Provider store = {store}>
    <Router basename={process.env.REACT_APP_BASENAME || ""}>
      <Switch>
        <div>
          {routes.map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={withTracker(props => {
                  return (
                    <route.layout {...props}>
                      <route.component {...props} />
                    </route.layout>
                  );
                })}
              />
            );
          })}
        </div>
      </Switch>
    </Router>
  </Provider>
);
