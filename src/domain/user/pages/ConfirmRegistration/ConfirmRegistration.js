import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spin, Result } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
import { API } from '../../../../config';

const ConfirmRegistration = (props) => {
  // const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();

  useEffect(() => {
    const { emailVerifyToken } = params;
    setIsLoading(true);
    fetch(`${API}/user/auth/confirm-registration/${emailVerifyToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setIsLoading(false);
        console.log(response);
        if (response.success) {
          setDone(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [params]);

  let content = (
    <Result
      status="success"
      title="Bạn đã kích hoạt tài khoản thành công!"
      extra={[
        <Button type="primary">
          <Link to="/login">Về trang đăng nhập</Link>
        </Button>,
      ]}
    />
  );

  if (isLoading && !done) {
    content = (
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 80,
              margin: '0 auto',
              marginTop: '16px',
              width: '100%',
            }}
            spin
          />
        }
      />
    );
  }

  if (!isLoading && !done) {
    content = (
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
    );
  }

  return content;
};

export default ConfirmRegistration;
