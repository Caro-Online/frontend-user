import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { SiHappycow } from 'react-icons/si';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  message,
  Switch,
  Typography,
  Alert,
} from 'antd';
import {
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from '@ant-design/icons';

import Modal from '../../../shared/components/Modal/Modal';
import InputRoomIdModal from '../../../shared/components/InputRoomIdModal/InputRoomIdModal';

import { API } from '../../../config';
import './Home.css';

const { Title } = Typography;

const { Option } = Select;

const Home = (props) => {
  const { isAuthenticated } = props;
  const location = useLocation();
  const history = useHistory();

  const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);
  const [openInputRoomIdModal, setOpenInputRoomIdModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [havePassword, setHavePassword] = useState(false);

  useEffect(() => {
    if (location.state) {
      if (location.state.returnFromResetPassword)
        message.success('Email đặt lại mật khẩu đã được gửi đi!');
      else if (location.state.returnFromUpdatePassword) {
        message.success('Mật khẩu của bạn đã được thay đổi!');
      }
    }
  }, [location]);

  const onClickLoginButtonHandler = () => {
    history.push('/login');
  };

  const onClickRegisterButtonHandler = () => {
    history.push('/register');
  };

  const onClickPlayNowButtonHandler = () => {};

  const onClickFindRoomsHandler = () => {
    history.push('/rooms');
  };

  const onClickCreateRoomButtonHandler = () => {
    setOpenCreateRoomModal(true);
  };

  const closeCreateRoomModal = () => {
    setOpenCreateRoomModal(false);
  };

  const onClickJoinRoomHandler = () => {
    setOpenInputRoomIdModal(true);
  };

  const closeInputRoomIdModal = () => {
    setOpenInputRoomIdModal(false);
  };

  const onSubmitCreateRoomHandler = useCallback(
    (values) => {
      const { name, rule, roomPassword } = values;
      setIsLoading(true);
      fetch(`${API}/room`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          rule,
          userId: localStorage.getItem('userId'),
          roomPassword,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((response) => {
          history.push(`/room/${response.room.roomId}`);
          setIsLoading(false);
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    },
    [history]
  );

  const onSwitchChange = (checked) => {
    setHavePassword(checked);
  };

  let content = (
    <div className="home-container">
      <h2>
        <SiHappycow />
        <SiHappycow />
        <SiHappycow />
        Chào mừng bạn, hãy đăng nhập để chơi
      </h2>
      <button
        className="login-btn"
        style={{ marginBottom: '16px' }}
        onClick={onClickLoginButtonHandler}
      >
        Đăng nhập
      </button>
      <button className="register-btn" onClick={onClickRegisterButtonHandler}>
        Đăng ký
      </button>
    </div>
  );

  if (isAuthenticated) {
    content = (
      <div className="home-container">
        <h2>Chào mừng, {localStorage.getItem('userName')}</h2>
        <button
          className="home-button-auth"
          onClick={onClickPlayNowButtonHandler}
        >
          Chơi ngay
        </button>
        <button className="home-button-auth" onClick={onClickFindRoomsHandler}>
          Tìm phòng
        </button>
        <button className="home-button-auth" onClick={onClickJoinRoomHandler}>
          Tham gia phòng
        </button>
        <button
          className="home-button-auth"
          onClick={onClickCreateRoomButtonHandler}
        >
          Tạo phòng
        </button>
      </div>
    );
  }

  return (
    <>
      <Modal show={openCreateRoomModal} modalClosed={closeCreateRoomModal}>
        <Title className="create-room-header" level={2}>
          Tạo phòng
        </Title>
        {isLoading ? (
          <Spin style={{ fontSize: '64px' }} />
        ) : (
          <Form
            name="normal_register"
            className="create-room-form"
            onFinish={onSubmitCreateRoomHandler}
          >
            <Form.Item
              label="Tên phòng"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Tên phòng không được bỏ trống',
                },
              ]}
            >
              <Input
                type="text"
                placeholder="Phòng của tui"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              name="rule"
              label="Luật chơi"
              initialValue="BLOCK_TWO_SIDE"
            >
              <Select>
                <Option value="BLOCK_TWO_SIDE">Chặn hai đầu không thắng</Option>
                <Option value="NOT_BLOCK_TWO_SIDE">Chặn hai đầu thắng</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="havePassword"
              label="Đặt mật khẩu"
              valuePropName="checked"
            >
              <Switch onChange={onSwitchChange} />
            </Form.Item>

            {havePassword ? (
              <Form.Item
                label="Mật khẩu"
                name="roomPassword"
                rules={[
                  { required: true, message: 'Mật khẩu không được bỏ trống!' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="daylamatkhau"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            ) : null}

            <Form.Item>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  className="create-room-button"
                >
                  Tạo
                </Button>
                <Button
                  type="danger"
                  htmlType="button"
                  onClick={closeCreateRoomModal}
                  className="abort-create-room-button"
                >
                  Hủy
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Modal>

      <InputRoomIdModal
        show={openInputRoomIdModal}
        onClose={closeInputRoomIdModal}
      />
      {content}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps, null)(Home);
