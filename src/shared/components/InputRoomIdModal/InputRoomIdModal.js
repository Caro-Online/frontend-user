import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Alert, Form, Input, Button } from 'antd';

import Modal from '../Modal/Modal';

import apiGame from '../../../domain/game/apiGame';

const { Title } = Typography;

const InputRoomIdModal = (props) => {
  const [roomNotFound, setRoomNotFound] = useState('');
  const history = useHistory();
  const { show, onClose } = props;

  const onCloseAlert = useCallback((e) => {
    setRoomNotFound(false);
  }, []);

  const onSubmitJoinRoomHandler = useCallback(
    (values) => {
      const { roomId } = values;
      apiGame
        .getRoomInfoById(roomId)
        .then((res) => {
          if (res.data.room) {
            history.push(`/room/${roomId}`);
          } else {
            setRoomNotFound(true);
          }
        })
        .catch((error) => {
          setRoomNotFound(true);
        });
    },
    [history]
  );

  return (
    <Modal show={show} modalClosed={onClose}>
      <Title className="create-room-header" level={2}>
        Nhập id phòng
      </Title>
      {roomNotFound ? (
        <Alert
          message="Lỗi"
          description="Phòng không tồn tại"
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
