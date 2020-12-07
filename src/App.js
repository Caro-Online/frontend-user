import './App.css';
import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import MainHeader from './shared/components/MainHeader/MainHeader';

const Register = lazy(() => import('./domain/user/pages/Register/Register'));
const Login = lazy(() => import('./domain/user/pages/Login/Login'));

const { Content, Footer } = Layout;

const App = () => {
  let routes = (
    <Switch>
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <Redirect to="/" />
    </Switch>
  );

  return (
    <>
      <Layout>
        <MainHeader />
        <Suspense fallback={<LoadingOutlined style={{ fontSize: 100 }} spin />}>
          <Content>{routes}</Content>
        </Suspense>
        <Footer>Footer</Footer>
      </Layout>
    </>
  );
};

export default App;
