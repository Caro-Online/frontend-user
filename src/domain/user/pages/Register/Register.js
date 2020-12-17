import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Card, Typography, Form, Input, Button, Alert, Spin } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  IdcardOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoadingOutlined,
} from '@ant-design/icons';

import 'antd/dist/antd.css';
import './Register.css';
import { API } from '../../../../config';

const { Title } = Typography;

const Register = (props) => {
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const onFinish = async (values) => {
    const { name, email, password } = values;

    try {
      setIsLoading(true);
      const res = await fetch(`${API}/user/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
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
        history.push('/login');
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setAuthError(error.message);
    }
  };

  return (
    <>
      <Link to="/" className="caro-online">
        <Title>CaroOnline</Title>
      </Link>
      <Card className="card" title="Đăng ký">
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
            name="normal_register"
            className="register-form"
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Tên không được bỏ trống!',
                },
              ]}
            >
              <Input
                prefix={<IdcardOutlined className="site-form-item-icon" />}
                type="text"
                placeholder="Tên"
              />
            </Form.Item>
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
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Password không được bỏ trống!',
                },
                {
                  pattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/,
                  message:
                    'Password phải bao gồm 1 chữ thường, 1 số và 1 chữ hoa!',
                },
                {
                  min: 6,
                  max: 32,
                  message:
                    'Password phải từ 6 đến 32 ký tự!',
                },
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
              >
                Đăng ký
              </Button>
              <div style={{ textAlign: 'center' }}>
                Hoặc <Link to="/login">Đăng nhập!</Link>
              </div>
            </Form.Item>
          </Form>
        )}
      </Card>
    </>
  );
};

export default Register;
