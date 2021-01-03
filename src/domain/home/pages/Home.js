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
  Divider,
  Row,
  Col,
  Space,
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
import {
  getUserIdFromStorage,
  getTokenFromStorage,
  getUsernameFromStorage,
} from '../../../shared/utils/utils';
import api from '../../game/apiGame';
import { AiOutlineReload } from 'react-icons/ai';
const { Title, Text } = Typography;

const { Option } = Select;

const Home = (props) => {
  const { isAuthenticated } = props;
  const location = useLocation();
  const history = useHistory();

  const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [openInputRoomIdModal, setOpenInputRoomIdModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [havePassword, setHavePassword] = useState(false);
  const [retry, setRetry] = useState(false);
  const [tipContent, setTipContent] = useState('Đang tìm phòng...');
  const countDownDurationArray = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
  ])[0];
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

  const onClickPlayNowButtonHandler = () => {
    setShowDialog(true);
    setRetry(false);
    setTipContent('Đang tìm phòng...');
    api
      .getRandomRoom()
      .then((res) => {
        const data = res.data;
        const { roomId } = data.room;
        setIsLoading(false);
        if (roomId && !showDialog) {
          history.push(`room/${roomId}`);
        }
        console.log(`getRandomRoom`, data, roomId, showDialog);
      })
      .catch((err) => {
        setIsLoading(false);
        setTipContent('Hiện tại không còn phòng trống, vui lòng thử lại...');
        setRetry(true);
        console.error(err);
      });
  };
  const onCloseDialog = () => {
    setShowDialog(false);
    console.log(`setShowDialog`, showDialog);
  };

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
      const { name, rule, roomPassword, countdownDuration } = values;
      setIsLoading(true);
      fetch(`${API}/room`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          rule,
          userId: getUserIdFromStorage(),
          roomPassword,
          countdownDuration,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getTokenFromStorage()}`,
        },
      })
        .then((res) => res.json())
        .then((response) => {
          history.push({
            pathname: `/room/${response.room.roomId}`,
            state: {
              hihihi: true,
            },
          });
          setIsLoading(false);
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
        <h2>Chào mừng, {getUsernameFromStorage()}</h2>
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
            <Form.Item name="rule" label="Luật chơi" initialValue={true}>
              <Select>
                <Option value={true}>Chặn hai đầu không thắng</Option>
                <Option value={false}>Chặn hai đầu thắng</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="countdownDuration"
              label="Thời gian cho một nước"
              initialValue={20}
            >
              <Select>
                {countDownDurationArray.map((cd) => (
                  <Option key={cd} value={cd * 5}>
                    {cd * 5} giây
                  </Option>
                ))}
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
      <Modal show={showDialog}>
        <Row justify="center">
          <Space align="center">
            <Col style={{ margin: '8px 0' }} span={24}>
              <Spin tip={tipContent}></Spin>
            </Col>
          </Space>
          <Col span={24}>
            <Divider style={{ margin: '8px 0' }}></Divider>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                block={!retry}
                danger
                onClick={onCloseDialog}
              >
                Huỷ
              </Button>
              {retry && (
                <Button
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 8,
                  }}
                  type="primary"
                  onClick={onClickPlayNowButtonHandler}
                >
                  <AiOutlineReload style={{ marginRight: 4 }} fontSize={14} />
                  Thử lại
                </Button>
              )}
            </div>
          </Col>
        </Row>
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
