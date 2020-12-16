import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import PrivateRoute from './shared/components/PrivateRoute/PrivatetRoute'
// import 'antd/dist/antd.css';
import './App.css';
import MainHeader from './shared/components/MainHeader/MainHeader';
import * as actions from './store/actions';

import Home from './domain/home/pages/Home';
import GamePage from './domain/game/pages/GamePage/GamePage';
const Logout = lazy(() => import('./domain/user/pages/Logout/Logout'));
const Register = lazy(() => import('./domain/user/pages/Register/Register'));
const Login = lazy(() => import('./domain/user/pages/Login/Login'));
const Rooms = lazy(() => import('./domain/game/pages/Rooms/Rooms'));


const { Content, Footer } = Layout;

const App = (props) => {
  const { onTryAutoLogin } = props;

  useEffect(() => {
    onTryAutoLogin();
  }, [onTryAutoLogin]);

  // useEffect(() => {
  //   let socket;
  //   if (props.isAuthenticated) {
  //     socket = initSocket(localStorage.getItem('userId'));
  //     // history.push('/');
  //     return () => {
  //       socket.disconnect();
  //     };
  //   }
  // }, [props.isAuthenticated, history]);

  let routes = (
    <Switch>
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <Route path="/" exact component={Home} />
      <PrivateRoute path="/logout" exact >  <Logout /> </PrivateRoute>
      <PrivateRoute path="/rooms" exact ><Rooms /></PrivateRoute>
      <PrivateRoute path="/room/:roomId" exact > <GamePage /> </PrivateRoute>
    </Switch>
  );

  return (
    <>
      <Layout>
        <MainHeader />
        <Suspense fallback={<LoadingOutlined style={{ fontSize: 100 }} spin />}>
          <Content style={{ marginTop: '64px', backgroundColor: 'white' }}>
            {routes}
          </Content>
        </Suspense>
        {/* <Footer style={{ backgroundColor: 'white' }}>Footer</Footer> */}
      </Layout>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoLogin: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
