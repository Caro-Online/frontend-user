import React, { useState } from 'react';
import { Form, Input, Button, Alert, Spin } from 'antd';
import { Link, useHistory } from 'react-router-dom';
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

import { login, signinWithGoogle, signinWithFacebook } from '../../apiUser';
import './Login.css';

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

const Login = () => {
  const [form] = Form.useForm();
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const onFinish = (values) => {
    const { email, password } = values;
    setIsLoading(true);
    login({ email, password })
      .then((res) => {
        setIsLoading(false);
        console.log(res.data);
        if (res.data) {
          history.push('/');
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setAuthError(error.message);
      });
    // fetch('http://localhost:4000/user/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((response) => {
    //     if (response.success) {
    //       history.push('/');
    //     } else {
    //       setAuthError(response.message);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     setAuthError(error.message);
    //   });
  };

  const responseSuccessGoogle = (response) => {
    const { tokenId } = response;

    signinWithGoogle(tokenId)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const responseFacebook = (response) => {
    const { userID, accessToken } = response;
    signinWithFacebook(userID, accessToken)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
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
            style={{ marginBottom: '16px' }}
          />
        ) : null}
        {isLoading ? (
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

export default Login;
