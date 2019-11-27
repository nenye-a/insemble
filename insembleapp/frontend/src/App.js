import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";

const trackingID  = 'UA-153536736-1'
import ReactGA from 'react-ga';
ReactGA.initialize(trackingID);

import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

import { Provider } from 'react-redux';
import store from './redux/store';
import { loadUser } from './redux/actions/auth'

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/main.scss";


class App extends React.Component {

  componentDidMount() {
    store.dispatch(loadUser())
  }

  render() {
    return (
      <Provider store = {store}>
        <Router basename={process.env.REACT_APP_BASENAME  || ""} history={history} >
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
  }
}

history.listen(location => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});


// function initializeReactGA() {
//   ReactGA.initialize('UA-153536736-1');
//   ReactGA.pageview('/');
// }

export default App;
