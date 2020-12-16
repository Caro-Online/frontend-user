import React, { useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Input, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { Card, Typography } from 'antd';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import {
  MailOutlined,
  LoadingOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GooglePlusOutlined,
  FacebookOutlined,
} from '@ant-design/icons';

import './Login.css';
import * as actions from '../../../../store/actions';

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const tailLayout = {
  wrapperCol: {
    span: 24,
  },
};

const Login = (props) => {
  const [form] = Form.useForm();

  const {
    onLoginWithEmailAndPassword,
    onLoginWithFacebook,
    onLoginWithGoogle,
    onClearError,
    onSetRedirectPath,
    onResetAuthRedirectPath,
    authError,
    authRedirectPath,
    loading,
  } = props;

  const onFinish = useCallback(
    (values) => {
      const { email, password } = values;
      onLoginWithEmailAndPassword(email, password);
    },
    [onLoginWithEmailAndPassword]
  );

  const responseSuccessGoogle = useCallback(
    (response) => {
      const { tokenId } = response;
      console.log(response.tokenId);
      onLoginWithGoogle(tokenId);
    },
    [onLoginWithGoogle]
  );

  const responseFacebook = useCallback(
    (response) => {
      const { userID, accessToken } = response;
      onLoginWithFacebook(userID, accessToken);
    },
    [onLoginWithFacebook]
  );

  const onCloseAlert = useCallback(
    (e) => {
      onClearError();
    },
    [onClearError]
  );
  let redirect = null;
  if (authRedirectPath) {
    redirect = <Redirect to={authRedirectPath} />;
    onResetAuthRedirectPath();
  }

  return (
    <>
      {redirect}
      <Link to="/" className="caro-online">
        <Title>CaroOnline</Title>
      </Link>
      <Card
        className="card"
        title="Login"
        bordered={false}
        style={{ width: 300 }}
      >
        {authError ? (
          <Alert
            message="Register Error"
            description={authError}
            type="error"
            closable
            showIcon
            onClose={onCloseAlert}
            style={{ marginBottom: '16px' }}
          />
        ) : null}
        {loading ? (
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
            className="center"
          />
        ) : (
          <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                type="email"
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Your Password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item {...tailLayout} className="login-form-button">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>

              <GoogleLogin
                clientId="990188398227-bb3t5mt068kdj4350d3mvmqhcqeftkl8.apps.googleusercontent.com"
                render={(renderProps) => (
                  <Button
                    icon={<GooglePlusOutlined />}
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="google-login mt-2"
                  >
                    Sign in with Google
                  </Button>
                )}
                onSuccess={responseSuccessGoogle}
                cookiePolicy={'single_host_origin'}
              />
              <FacebookLogin
                appId="891593248045556"
                autoLoad={false}
                fields="name,email,id"
                callback={responseFacebook}
                cssClass="facebook-login"
                icon={<FacebookOutlined />}
                textButton="&nbsp;&nbsp;Sign In with Facebook"
              />
              <Button
                className="redirect-to-register"
                type="link"
                htmlType="button"
                onClick
              >
                Don't have an account? Register
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    loading: state.auth.loading,
    authError: state.auth.error,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginWithEmailAndPassword: (email, password) =>
      dispatch(actions.authWithEmailAndPassword(email, password)),
    onLoginWithFacebook: (userId, accessToken) =>
      dispatch(actions.authWithFacebook(userId, accessToken)),
    onLoginWithGoogle: (tokenId) => dispatch(actions.authWithGoogle(tokenId)),
    onClearError: () => dispatch(actions.authClearError()),
    // onSetRedirectPath: () => dispatch(actions.setAuthRedirectPath()),
    onResetAuthRedirectPath: () => dispatch(actions.resetAuthRedirectPath()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
