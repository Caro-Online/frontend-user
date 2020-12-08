import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
import './App.css';
import MainHeader from './shared/components/MainHeader/MainHeader';
import { useStore } from './hooks-store/store';
import { initSocket } from './shared/utils/socket.io-client';

const Logout = lazy(() => import('./domain/user/pages/Logout/Logout'));
const Register = lazy(() => import('./domain/user/pages/Register/Register'));
const Login = lazy(() => import('./domain/user/pages/Login/Login'));
const AllUser = lazy(() => import('./domain/user/pages/AllUser/AllUser'));

const { Content, Footer } = Layout;

const App = () => {
  const [globalState, dispatch] = useStore();
  const isAuthenticated = globalState.auth.token !== null;

  useEffect(() => {
    dispatch('AUTH_AUTO_LOGIN');
  }, [dispatch]);

  useEffect(() => {
    console.log(isAuthenticated);
    let socket;
    if (isAuthenticated) {
      socket = initSocket(localStorage.getItem('userId'));
      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated]);

  let routes = (
    <Switch>
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <Redirect to="/" />
    </Switch>
  );

  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/all-user" exact component={AllUser} />
        <Route path="/logout" exact component={Logout} />
        {/* <Redirect to="/" /> */}
      </Switch>
    );
  }

  return (
    <>
      <Layout>
        <MainHeader />
        <Suspense fallback={<LoadingOutlined style={{ fontSize: 100 }} spin />}>
          <Content style={{ marginTop: '64px', backgroundColor: 'white' }}>
            {routes}
          </Content>
        </Suspense>
        <Footer style={{ backgroundColor: 'white' }}>Footer</Footer>
      </Layout>
    </>
  );
};

export default App;
