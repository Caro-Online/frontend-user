import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { SiHappycow } from 'react-icons/si';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, Select, Spin } from 'antd';

import Modal from '../../../shared/components/Modal/Modal';

import { API } from '../../../config';
import './Home.css';

const { Option } = Select;

const Home = (props) => {
  const { isAuthenticated } = props;

  const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);
  const [openInputRoomIdModal, setOpenInputRoomIdModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const onClickLoginButtonHandler = () => {
    history.push('/login');
  };

  const onClickRegisterButtonHandler = () => {
    history.push('/register');
  };

  const onClickPlayNowButtonHandler = () => { };

  const onClickFindRoomsHandler = () => {
    history.push('/rooms');
  };

  const onClickJoinRoomHandler = () => {
    setOpenInputRoomIdModal(true);
  };

  const onClickCreateRoomButtonHandler = () => {
    setOpenCreateRoomModal(true);
  };

  const closeCreateRoomModal = () => {
    setOpenCreateRoomModal(false);
  };

  const closeInputRoomIdModal = () => {
    setOpenInputRoomIdModal(false);
  };

  const onSubmitCreateRoomHandler = useCallback((values) => {
    const { name, rule } = values;
    setIsLoading(true);
    fetch(`${API}/game`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        rule,
        userId: localStorage.getItem('userId'),
      }),
      headers: {
        'Content-Type': 'application/json',
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
  }, []);

  const onSubmitJoinRoomHandler = useCallback(
    (values) => {
      const { roomId } = values;
      history.push(`/room/${roomId}`);
    },
    [history]
  );

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
        Login
      </button>
      <button className="register-btn" onClick={onClickRegisterButtonHandler}>
        Register
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
        <h1 className="create-room-header">Tạo phòng</h1>
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
              <Form.Item name="rule" label="Luật chơi">
                <Select
                  style={{
                    width: 240,
                  }}
                  defaultValue="BLOCK_TWO_SIDE"
                >
                  <Option value="BLOCK_TWO_SIDE">Chặn hai đầu không thắng</Option>
                  <Option value="NOT_BLOCK_TWO_SIDE">Chặn hai đầu thắng</Option>
                </Select>
              </Form.Item>
              <Form.Item>
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
              </Form.Item>
            </Form>
          )}
      </Modal>
      <Modal show={openInputRoomIdModal} modalClosed={closeInputRoomIdModal}>
        <h1 className="create-room-header">Nhập id phòng</h1>
        <Form
          name="normal_register"
          className="create-room-form"
          onFinish={onSubmitJoinRoomHandler}
        >
          <Form.Item
            label="Id phòng"
            name="roomId"
            rules={[
              {
                required: true,
                message: 'Id phòng không được bỏ trống',
              },
              {
                len: 6,
                message: 'Id phòng phải đúng 6 ký tự',
              },
            ]}
          >
            <Input type="text" placeholder="1K3n2S" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="create-room-button"
            >
              Tham gia
            </Button>
            <Button
              type="danger"
              htmlType="button"
              onClick={closeCreateRoomModal}
              className="abort-create-room-button"
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
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
