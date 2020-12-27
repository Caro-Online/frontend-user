import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
// import 'antd/dist/antd.css';
import './App.css';
import { initSocket } from './shared/utils/socket.io-client';
import * as actions from './store/actions';
import { getUserIdFromStorage } from './shared/utils/utils';

import PrivateRoute from './shared/components/PrivateRoute/PrivatetRoute';
import MainHeader from './shared/components/MainHeader/MainHeader';
import Home from './domain/home/pages/Home';
import GamePage from './domain/game/pages/GamePage/GamePage';
const Logout = lazy(() => import('./domain/user/pages/Logout/Logout'));
const Register = lazy(() => import('./domain/user/pages/Register/Register'));
const ConfirmRegistration = lazy(() =>
  import('./domain/user/pages/ConfirmRegistration/ConfirmRegistration')
);
const Login = lazy(() => import('./domain/user/pages/Login/Login'));
const ResetPassword = lazy(() =>
  import('./domain/user/pages/ResetPassword/ResetPassword')
);
const UpdatePassword = lazy(() =>
  import('./domain/user/pages/UpdatePassword/UpdatePassword')
);
const Rooms = lazy(() => import('./domain/game/pages/Rooms/Rooms'));

const { Content } = Layout;
const App = (props) => {
  const { isAuthenticated, onTryAutoLogin, socket } = props;

  useEffect(() => {
    onTryAutoLogin();
  }, [onTryAutoLogin]);

  useEffect(() => {
    if (socket) {
      // let socket;
      // socket = initSocket(getUserIdFromStorage());
      // console.log('Init socket');
      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, socket]);

  console.log(isAuthenticated);

  let routes = (
    <Switch>
      <Route path="/register" exact component={Register} />
      <Route
        path="/confirm-registration/:emailVerifyToken"
        exact
        component={ConfirmRegistration}
      />
      <Route path="/login" exact component={Login} />
      <Route path="/reset-password" exact component={ResetPassword} />
      <Route
        path="/reset-password/:resetToken"
        exact
        component={UpdatePassword}
      />
      <Route path="/" exact component={Home} />
      {/* <Redirect to="/" /> */}
    </Switch>
  );
  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/rooms" exact component={Rooms} />
        <Route path="/room/:roomId" exact component={GamePage} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <Layout>
      <MainHeader />
      <Suspense fallback={<LoadingOutlined style={{ fontSize: 100 }} spin />}>
        <Content style={{ backgroundColor: 'white' }}>{routes}</Content>
      </Suspense>
      {/* <Footer
        style={{
          textAlign: "center",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        Powered by HHH Team ©2020
      </Footer> */}
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    socket: state.auth.socket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoLogin: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
