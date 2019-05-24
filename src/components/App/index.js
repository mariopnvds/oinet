import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import Notification from '../NotificationChange';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import Network from '../Network';
import Map from '../Map';
import FirmsList from '../FirmsList';
import Charts from '../Charts';
import Projects from '../ProjectsList';
import Profile from '../Profile';
import Root from '../SingUpRoot'


import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const Index = () => (
  <Router>
    <div style={{paddingLeft: '64px'}}>
      <Navigation />
      <Route exact path={ROUTES.NOTIFICATION} component={Notification}/>
      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
      {/*<Route exact path={ROUTES.ADMIN} component={AdminPage} />*/}
      <Route exact path={ROUTES.NETWORK} component={Network} />
      <Route exact path={ROUTES.MAP} component={Map} />
      <Route exact path={ROUTES.LIST} component={FirmsList} />
      <Route exact path={ROUTES.CHARTS} component={Charts} />
      <Route exact path={ROUTES.PROJECTSLIST} component={Projects} />
      <Route exact path={ROUTES.PROFILE} component={Profile} />
      <Route exact path={ROUTES.ROOT} component={Root} />
    </div>
  </Router>
);

export default withAuthentication(Index);
