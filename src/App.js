import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
import './App.css';
import MainHeader from './shared/components/MainHeader/MainHeader';

const Register = lazy(() => import('./domain/user/pages/Register/Register'));
const Login = lazy(() => import('./domain/user/pages/Login/Login'));
const AllUser = lazy(() => import('./domain/user/pages/AllUser/AllUser'));

const { Content, Footer } = Layout;

const App = () => {
  let routes = (
    <Switch>
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <Route path="/all-user" exact component={AllUser} />
      <Redirect to="/" />
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
        <Footer style={{ backgroundColor: 'white' }}>Footer</Footer>
      </Layout>
    </>
  );
};

export default App;
