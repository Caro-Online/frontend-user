import React, { useState, useEffect, useCallback } from 'react';
import {
  PageHeader,
  Button,
  Descriptions,
  Spin,
  Statistic,
  Typography,
  Table,
  Tooltip,
  Badge,
  Form,
  Input,
  Alert,
} from 'antd';
import { useHistory } from 'react-router-dom';
import {
  LoadingOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  LockTwoTone,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { FaGamepad, FaPlay, FaUser, FaUsers } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { GiRuleBook } from 'react-icons/gi';
import { GrStatusInfo } from 'react-icons/gr';
import { CgPlayPauseR, CgPlayButtonR } from 'react-icons/cg';

import InputRoomIdModal from '../../../../shared/components/InputRoomIdModal/InputRoomIdModal';
import Modal from '../../../../shared/components/Modal/Modal';

import './Rooms.css';
import api from '../../apiGame';

const { Title } = Typography;

const Rooms = (props) => {
  const [rooms, setRooms] = useState([]);
  const [waitingRooms, setWaitingRooms] = useState([]);
  const [playingRooms, setPlayingRooms] = useState([]);
  const [openInputRoomIdModal, setOpenInputRoomIdModal] = useState(false);
  const [openInputPasswordModal, setOpenInputPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [realRoomPassword, setRealRoomPassword] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [passwordFail, setPasswordFail] = useState(false);
  const history = useHistory();

  const onClickJoinRoomByIdHandler = useCallback(() => {
    setOpenInputRoomIdModal(true);
  }, []);

  const closeInputRoomIdModal = useCallback(() => {
    setOpenInputRoomIdModal(false);
  }, []);

  const onClickJoinRoomHandler = useCallback((roomPassword, roomId) => {
    setOpenInputPasswordModal(true);
    setRealRoomPassword(roomPassword);
    setRoomId(roomId);
  }, []);

  const closeInputPasswordModal = useCallback(() => {
    setOpenInputPasswordModal(false);
    setRealRoomPassword(null);
    setRoomId(null);
    setPasswordFail(false);
  }, []);

  const onCloseAlert = useCallback((e) => {
    setPasswordFail(false);
  }, []);

  const onSubmitInputPasswordHandler = useCallback(
    (values) => {
      const { roomPassword } = values;
      if (roomPassword !== realRoomPassword) setPasswordFail(true);
      else history.push(`/room/${roomId}`);
    },
    [history, realRoomPassword, roomId]
  );

  useEffect(() => {
    setIsLoading(true);
    api
      .getAllRoom()
      .then((res) => {
        setIsLoading(false);
        if (res.data.success) {
          const rooms = res.data.rooms.map((room) => {
            let numPeople = [];
            if (room.user.u1) {
              numPeople.push('1');
            }
            if (room.user.u2) {
              numPeople.push('1');
            }
            for (let i = 0; i < room.audience.length; i++) {
              numPeople.push('1');
            }
            return { ...room, key: room._id, numPeople: numPeople };
          });
          setRooms(rooms);
          const waitingRooms = rooms.filter((room) => {
            return room.status === 'WAITING';
          });
          const playingRooms = rooms.filter((room) => {
            return room.status === 'PLAYING';
          });
          setWaitingRooms(waitingRooms);
          setPlayingRooms(playingRooms);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const columns = [
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaGamepad size="24" style={{ marginRight: '8px' }} />
          <Title level={3} style={{ marginBottom: 0 }}>
            Tên phòng
          </Title>
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      render: (name) => <span style={{ fontWeight: 'bold' }}>{name}</span>,
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <GiRuleBook size="24" style={{ marginRight: '8px' }} />
          <Title level={3} style={{ marginBottom: 0 }}>
            Luật chơi
          </Title>
        </div>
      ),
      dataIndex: 'rule',
      key: 'rule',
      render: (rule) => (
        <>{rule === 'BLOCK_TWO_SIDE' ? 'Chặn 2 đầu' : 'Không chặn 2 đầu'} </>
      ),
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <GrStatusInfo size="24" style={{ marginRight: '8px' }} />
          <Title level={3} style={{ marginBottom: 0 }}>
            Trạng thái
          </Title>
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div style={{ textAlign: 'center' }}>
          {status === 'WAITING' ? (
            <Tooltip title="Đang chờ">
              <CgPlayPauseR style={{ fontSize: '32px' }} color="orange" />
            </Tooltip>
          ) : (
            <Tooltip title="Đang chơi">
              <CgPlayButtonR style={{ fontSize: '32px' }} color="green" />
            </Tooltip>
          )}{' '}
        </div>
      ),
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaUsers size="24" style={{ marginRight: '8px' }} />
          <Title level={3} style={{ marginBottom: 0 }}>
            Số người
          </Title>
        </div>
      ),
      dataIndex: 'numPeople',
      key: 'numPeople',
      render: (numPeople) => {
        return numPeople.map((people, index) => (
          <FaUser key={index} style={{ marginRight: '6px' }} color="green" />
        ));
      },
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaPlay size="24" style={{ marginRight: '8px' }} />
          <Title level={3} style={{ marginBottom: 0 }}>
            Hành động
          </Title>
        </div>
      ),
      key: 'action',
      render: (text, record) => {
        return (
          <>
            {record.password ? (
              <Badge
                count={
                  <Tooltip title="Phòng này có yêu cầu mật khẩu">
                    <LockTwoTone twoToneColor="red" />
                  </Tooltip>
                }
              >
                <Button
                  onClick={() =>
                    onClickJoinRoomHandler(record.password, record.roomId)
                  }
                  icon={<FiLogIn style={{ marginRight: '8px' }} />}
                >
                  Tham gia
                </Button>
              </Badge>
            ) : (
              <Button
                onClick={() => {
                  history.push(`/room/${record.roomId}`);
                }}
                icon={<FiLogIn style={{ marginRight: '8px' }} />}
              >
                Tham gia
              </Button>
            )}
          </>
        );
      },
    },
  ];

  let content = (
    <>
      <Modal
        show={openInputPasswordModal}
        modalClosed={closeInputPasswordModal}
      >
        <Title className="create-room-header" level={2}>
          Nhập mật khẩu
        </Title>
        {passwordFail ? (
          <Alert
            message="Lỗi"
            description="Mật khẩu phòng không đúng"
            type="error"
            closable
            showIcon
            onClose={onCloseAlert}
            style={{ marginBottom: '16px' }}
          />
        ) : null}
        {isLoading ? (
          <Spin style={{ fontSize: '64px' }} />
        ) : (
          <Form
            name="normal_register"
            className="create-room-form"
            onFinish={onSubmitInputPasswordHandler}
          >
            <Form.Item name="roomId" hidden initialValue={roomId}>
              <Input type="hidden" value={roomId} />
            </Form.Item>
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
                  onClick={closeInputPasswordModal}
                  style={{ marginLeft: '8px' }}
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
      <div className="container">
        <div className="site-page-header-ghost-wrapper">
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title="Danh sách các phòng"
            subTitle="Nhấn vào phòng để tham gia"
            extra={[
              <Button
                key="2"
                shape="round"
                size="large"
                style={{ display: 'flex', alignItems: 'center' }}
                icon={<SearchOutlined />}
                onClick={onClickJoinRoomByIdHandler}
              >
                Tham gia phòng bằng id
              </Button>,
              <Button
                key="1"
                type="primary"
                shape="round"
                size="large"
                style={{ display: 'flex', alignItems: 'center' }}
                icon={<PlayCircleOutlined />}
              >
                Chơi ngay
              </Button>,
            ]}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item
                label={
                  <Title level={5} style={{ marginBottom: 0 }}>
                    Tổng số phòng
                  </Title>
                }
              >
                <Statistic value={rooms.length} />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Title level={5} style={{ marginBottom: 0 }}>
                    Số phòng đang chờ
                  </Title>
                }
              >
                <Statistic value={waitingRooms.length} />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Title level={5} style={{ marginBottom: 0 }}>
                    Số phòng đang chơi
                  </Title>
                }
              >
                <Statistic value={playingRooms.length} />
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
        </div>
        <div className="row" style={{ marginTop: '8px' }}>
          <Table bordered columns={columns} dataSource={rooms} />
        </div>
      </div>
    </>
  );

  if (isLoading) {
    content = (
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
        className="center"
      />
    );
  }

  return content;
};

export default Rooms;
