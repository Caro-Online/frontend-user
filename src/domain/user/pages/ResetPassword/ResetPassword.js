import React, { useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Alert,
  Spin,
  Result,
} from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
import './ResetPassword.css';
import { API } from '../../../../config';

const { Title } = Typography;

const ResetPassword = (props) => {
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const onFinish = async (values) => {
    const { email } = values;

    try {
      setIsLoading(true);
      const res = await fetch(`${API}/user/auth/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await res.json();
      if (!response.success) {
        setIsLoading(false);
        setAuthError(response.message);
      } else {
        setIsLoading(false);
        // setEmailHasSent(true);
        history.push({
          pathname: '/',
          state: {
            returnFromResetPassword: true,
          },
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setAuthError(error.message);
    }
  };

  const onCloseAlert = useCallback((e) => {
    setAuthError(null);
  }, []);

  return (
    <>
      <Link to="/" className="caro-online">
        <Title>CaroOnline</Title>
      </Link>
      <Card className="card" title="Quên mật khẩu">
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
        {isLoading ? (
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
            className="center"
          />
        ) : (
          <Form
            name="normal_register"
            className="register-form"
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Email không được bỏ trống!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                type="email"
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
              >
                Tìm kiếm
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </>
  );
};

export default ResetPassword;
