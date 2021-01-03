import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Typography,
  Alert,
  Form,
  Input,
  Button,
  message as antMessage,
} from 'antd';
import {
  EyeTwoTone,
  EyeInvisibleOutlined,
  LockOutlined,
} from '@ant-design/icons';

import Modal from '../Modal/Modal';

import apiGame from '../../../domain/game/apiGame';

const { Title } = Typography;

const InputRoomIdModal = (props) => {
  const { show, onClose } = props;
  const history = useHistory();
  const [alertMessage, setAlertMessage] = useState(null);
  const [roomHavePassword, setRoomHavePassword] = useState(false);

  const onCloseAlert = useCallback((e) => {
    setAlertMessage(null);
  }, []);

  const onSubmitJoinRoomHandler = useCallback(
    async (values) => {
      const { roomId, roomPassword } = values;
      console.log(roomPassword);
      let message, room;
      try {
        const response = await apiGame.getRoomInfoById(roomId);
        message = response.data.message;
        room = response.data.room;
      } catch (err) {
        console.log(err);
        antMessage.error(err.message);
        setAlertMessage(err.message);
      }
      console.log(room);
      if (!room) {
        setAlertMessage(message);
        return;
      }
      if (!roomPassword) {
        // Nếu phòng có mật khẩu
        if (room.password) {
          setRoomHavePassword(true);
        } else {
          // Nếu không có password
          history.push({
            pathname: `/room/${roomId}`,
            state: { haveEnterPassword: true },
          });
        }
      } else {
        // So khớp mật khẩu
        console.log(roomPassword, room.password);
        if (roomPassword.toString() === room.password.toString()) {
          history.push({
            pathname: `/room/${roomId}`,
            state: { haveEnterPassword: true },
          });
        } else {
          setAlertMessage('Sai mật khẩu phòng');
        }
      }
    },
    [history]
  );

  return (
    <Modal show={show} modalClosed={onClose}>
      <Title className="create-room-header" level={2}>
        Nhập id phòng
      </Title>
      {alertMessage ? (
        <Alert
          message="Lỗi"
          description={alertMessage}
          type="error"
          closable
          showIcon
          onClose={onCloseAlert}
          style={{ marginBottom: '16px' }}
        />
      ) : null}
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
        {roomHavePassword ? (
          <Form.Item
            label="Mật khẩu phòng"
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
              Tham gia
            </Button>
            <Button
              type="danger"
              htmlType="button"
              onClick={onClose}
              className="abort-create-room-button"
            >
              Hủy
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InputRoomIdModal;
