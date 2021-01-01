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

import PrivateRoute from './shared/components/Route/PrivatetRoute'
import PublicRoute from './shared/components/Route/PublicRoute';
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
      <Route path="/" exact component={Home} />
      <PublicRoute
        path="/register" exact >
        <Register />
      </PublicRoute>
      <PublicRoute
        path="/confirm-registration/:emailVerifyToken"
        exact>
        <ConfirmRegistration />
      </PublicRoute>
      <PublicRoute
        path="/login" exact >
        <Login />
      </PublicRoute>
      <PublicRoute
        path="/reset-password" exact>
        <ResetPassword />
      </PublicRoute>
      <PublicRoute
        path="/reset-password/:resetToken"
        exact>
        <UpdatePassword />
      </PublicRoute>
      //private route
      <PrivateRoute path="/logout" exact>
        <Logout />
      </PrivateRoute>
      <PrivateRoute path="/rooms" exact >
        <Rooms />
      </PrivateRoute>
      <PrivateRoute path="/room/:roomId" exact>
        <GamePage />
      </PrivateRoute>
      <Redirect to="/" />
    </Switch>
  );

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
