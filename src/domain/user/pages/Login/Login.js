import React, { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Alert, Spin, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import { Card, Typography } from "antd";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import {
  MailOutlined,
  LoadingOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GooglePlusOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

import "./Login.css";
import * as actions from "../../../../store/actions";

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
  const {
    onLoginWithEmailAndPassword,
    onLoginWithFacebook,
    onLoginWithGoogle,
    onClearError,
    onResetAuthRedirectPath,
    authError,
    authRedirectPath,
    loading,
  } = props;
  const history = useHistory();

  useEffect(() => {
    if (authRedirectPath) {
      history.push("/");
      message.success("Đăng nhập thành công");
      onResetAuthRedirectPath();
    }
  }, [authRedirectPath, history, onResetAuthRedirectPath]);

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

  return (
    <>
      {/* {redirect} */}
      {/* <Link to="/" className="caro-online">
        <Title>CaroOnline</Title>
      </Link> */}
      <Card
        className="card"
        title="Đăng Nhập"
        bordered={false}
        style={{ width: 300 }}
      >
        {authError ? (
          <Alert
            message="Lỗi đăng nhập"
            description={authError}
            type="error"
            closable
            showIcon
            onClose={onCloseAlert}
            style={{ marginBottom: "16px" }}
          />
        ) : null}
        {loading ? (
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
            className="center"
          />
        ) : (
          <Form {...layout} name="control-hooks" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email không được bỏ trống!" },
              ]}
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
                { required: true, message: "Mật khẩu không được bỏ trống!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item {...tailLayout} className="login-form-button">
              <Button type="primary" htmlType="submit">
                Đăng nhập
              </Button>

              <GoogleLogin
                clientId="1032785897839-f7ki1ppsk1bh0itmj2momm98qo09hcdc.apps.googleusercontent.com"
                render={(renderProps) => (
                  <Button
                    icon={<GooglePlusOutlined />}
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="google-login mt-2"
                  >
                    Đăng nhập bằng Google
                  </Button>
                )}
                onSuccess={responseSuccessGoogle}
                cookiePolicy={"single_host_origin"}
              />
              <FacebookLogin
                appId="310930160624429"
                autoLoad={false}
                fields="name,email,id"
                callback={responseFacebook}
                cssClass="facebook-login"
                icon={<FacebookOutlined />}
                textButton="&nbsp;&nbsp;Đăng nhập bằng Facebook"
              />
              <Button
                className="redirect-to-register"
                type="link"
                htmlType="button"
              >
                <Link to="/register">Bạn chưa có tài khoản? Đăng ký ngay!</Link>
              </Button>
              <Button
                className="redirect-to-register"
                type="link"
                htmlType="button"
              >
                <Link to="/reset-password">Quên mật khẩu?</Link>
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
    onResetAuthRedirectPath: () => dispatch(actions.resetAuthRedirectPath()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
