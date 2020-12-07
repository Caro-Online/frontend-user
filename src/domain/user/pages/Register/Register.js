import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Card, Typography, Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
import './Register.css';

const { Title } = Typography;

const Register = (props) => {
  const [authError, setAuthError] = useState(null);
  const history = useHistory();

  const onFinish = async (values) => {
    const { name, email, password } = values;

    try {
      const res = await fetch('http://localhost:4000/user/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await res.json();
      if (!response.success) {
        setAuthError(response.message);
      } else {
        history.push('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Link to="/" className="caro-online">
        <Title>CaroOnline</Title>
      </Link>
      <Card className="card" title="Register">
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
        <Form
          name="normal_register"
          className="register-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your Name!',
              },
            ]}
          >
            <Input
              prefix={<IdcardOutlined className="site-form-item-icon" />}
              type="text"
              placeholder="Your Name"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              type="email"
              placeholder="Your Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Your Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-form-button"
            >
              Register
            </Button>
            <div style={{ textAlign: 'center' }}>
              Or <Link to="/login">Login now!</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default Register;
