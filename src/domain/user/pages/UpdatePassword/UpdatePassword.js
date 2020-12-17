import React, { useEffect, useState, useCallback } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
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
import { LoadingOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
import './UpdatePassword.css';
import { API } from '../../../../config';

const { Title } = Typography;

const UpdatePassword = (props) => {
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    const { resetToken } = params;
    setIsLoading(true);
    fetch(`${API}/user/auth/reset-password/${resetToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        setIsLoading(false);
        setUserId(response.userId);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [params]);

  const onFinish = async (values) => {
    console.log(values);
    const { userId, password } = values;
    const { resetToken } = params;
    try {
      setIsLoading(true);
      const res = await fetch(`${API}/user/auth/new-password`, {
        method: 'POST',
        body: JSON.stringify({ userId, password, resetToken }),
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
        history.push({
          pathname: '/',
          state: { returnFromUpdatePassword: true },
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
      {!userId ? (
        <Result
          status="404"
          title="404"
          subTitle="Xin lỗi bạn, trang này không tồn tại"
          extra={
            <Button type="primary">
              <Link to="/">Về trang chủ</Link>
            </Button>
          }
        />
      ) : (
        <>
          <Link to="/" className="caro-online">
            <Title>CaroOnline</Title>
          </Link>
          <Card className="card" title="Thay đổi mật khẩu">
            {authError ? (
              <Alert
                message="Lỗi"
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
                <Form.Item name="userId" hidden initialValue={userId}>
                  <Input type="hidden" value={userId} />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    {
                      required: true,
                      message: 'Mật khẩu không được bỏ trống!',
                    },
                    {
                      pattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/,
                      message:
                        'Mật khẩu phải bao gồm 1 chữ thường, 1 số và 1 chữ hoa!',
                    },
                    {
                      min: 6,
                      max: 32,
                      message: 'Mật khẩu phải từ 6 đến 32 ký tự!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="Xác nhận"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Xác nhận mật khẩu không được để trống!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          'Mật khẩu và xác nhận mật khẩu không khớp!'
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="register-form-button"
                  >
                    Thay đổi mật khẩu
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Card>
        </>
      )}
    </>
  );
};

export default UpdatePassword;
