import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
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
  Space,
  message as antMessage,
} from 'antd';
import Highlighter from 'react-highlight-words';
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

const Rooms = ({ socket }) => {
  let searchInput = '';
  const [rooms, setRooms] = useState([]);
  const [waitingRooms, setWaitingRooms] = useState([]);
  const [playingRooms, setPlayingRooms] = useState([]);
  const [openInputRoomIdModal, setOpenInputRoomIdModal] = useState(false);
  const [openInputPasswordModal, setOpenInputPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [realRoomPassword, setRealRoomPassword] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [passwordFail, setPasswordFail] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const history = useHistory();

  const calculateNumPeople = useCallback((room) => {
    let numPeople = [];
    for (let i = 0; i < room.players.length; i++) {
      numPeople.push('1');
    }
    for (let i = 0; i < room.audiences.length; i++) {
      numPeople.push('1');
    }
    return numPeople;
  }, []);

  const setPlayingAndWaitingRooms = useCallback((updatedRooms) => {
    const waitingRooms = updatedRooms.filter((room) => {
      return room.status === 'WAITING';
    });
    const playingRooms = updatedRooms.filter((room) => {
      return room.status === 'PLAYING';
    });
    setWaitingRooms(waitingRooms);
    setPlayingRooms(playingRooms);
  }, []);

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
      else
        history.push({
          pathname: `/room/${roomId}`,
          state: { haveEnterPassword: true },
        });
    },
    [history, realRoomPassword, roomId]
  );

  useEffect(() => {
    let roomUpdateListener, newRoomListener;
    async function doStuff() {
      if (socket) {
        try {
          // // Lấy thông tin tất cả các phòng về
          // const response = await api.getAllRoom();
          // const { rooms } = response.data;
          // Lắng nghe sự kiện room-update để update lại thông tin phòng
          roomUpdateListener = ({ room }) => {
            console.log('In room update');
            if (room.status !== 'EMPTY') {
              let roomNeedToUpdate = rooms.find(
                (eachRoom) => eachRoom.roomId === room.roomId
              );
              roomNeedToUpdate = room;
              const indexRoomNeedToUpdate = rooms.findIndex(
                (eachRoom) => eachRoom.roomId === room.roomId
              );
              roomNeedToUpdate.numPeople = calculateNumPeople(roomNeedToUpdate);
              roomNeedToUpdate.key = room._id;

              let updatedRooms = _.cloneDeep(rooms);
              updatedRooms[indexRoomNeedToUpdate] = roomNeedToUpdate;
              setRooms(updatedRooms);
              setPlayingAndWaitingRooms(updatedRooms);
            } else {
              // Nếu status của room là rỗng thì pop room đó khỏi rooms
              let updatedRooms = _.cloneDeep(rooms);
              updatedRooms = updatedRooms.filter(
                (r) => r._id.toString() !== room._id.toString()
              );
              setRooms(updatedRooms);
              setPlayingAndWaitingRooms(updatedRooms);
            }
          };
          socket.on('room-update', roomUpdateListener);
          //Lắng nghe sự kiện new-room để thêm phòng mới
          newRoomListener = ({ room }) => {
            console.log('In new room');
            let addedRoom = { ...room };
            addedRoom.numPeople = calculateNumPeople(room);
            console.log(addedRoom.numPeople);
            addedRoom.key = room._id;
            let updatedRooms = _.cloneDeep(rooms);
            updatedRooms = [...updatedRooms, addedRoom];
            console.log(updatedRooms);
            setRooms(updatedRooms);
            setPlayingAndWaitingRooms(updatedRooms);
          };
          socket.on('new-room', newRoomListener);
        } catch (err) {
          console.log(err);
          antMessage.error(err);
        }
      }
    }
    doStuff();
    return () => {
      if (roomUpdateListener) {
        socket.off('room-update', roomUpdateListener);
      }
      if (newRoomListener) {
        socket.off('new-room', newRoomListener);
      }
    };
  }, [socket, calculateNumPeople, setPlayingAndWaitingRooms, rooms]);

  useEffect(() => {
    setIsLoading(true);
    api
      .getAllRoom()
      .then((res) => {
        setIsLoading(false);
        if (res.data.success) {
          const rooms = res.data.rooms.map((room) => {
            return {
              ...room,
              key: room._id,
              numPeople: calculateNumPeople(room),
            };
          });
          setRooms(rooms);
          setPlayingAndWaitingRooms(rooms);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [calculateNumPeople, setPlayingAndWaitingRooms]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
          text
        ),
  });

  const columns = [
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={5} style={{ marginBottom: 0 }}>
            Tên phòng
          </Title>
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      render: (name) => <span style={{ fontWeight: 'bold' }}>{name}</span>,
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={5} style={{ marginBottom: 0 }}>
            Luật chơi
          </Title>
        </div>
      ),
      dataIndex: 'rule',
      key: 'rule',
      filters: [
        {
          text: 'Chặn 2 đầu',
          value: true,
        },
        {
          text: 'Không chặn 2 đầu',
          value: false,
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        return record.rule.indexOf(value) === 0;
      },
      render: (rule) => <>{rule ? 'Chặn 2 đầu' : 'Không chặn 2 đầu'} </>,
    },
    {
      title: (
        <div style={{ display: 'flex', flex: "row", alignItems: 'center' }}>
          <Title level={5} style={{ marginBottom: 0 }}>
            Trạng thái
          </Title>
        </div >
      ),
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'Đang chờ',
          value: 'WAITING',
        },
        {
          text: 'Đang chơi',
          value: 'PLAYING',
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        return record.status.indexOf(value) === 0;
      },
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
          <Title level={5} style={{ marginBottom: 0 }}>
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
              </Button>
            ]}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item
                label={
                  <div style={{ marginBottom: 0 }}>
                    Tổng phòng
                  </div>
                }
              >
                {rooms.length}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div style={{ marginBottom: 0 }}>
                    Đang chờ
                  </div>
                }
              >
                {waitingRooms.length}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div style={{ marginBottom: 0 }}>
                    Đang chơi
                  </div>
                }
              >
                {playingRooms.length}
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

const mapStateToProps = (state) => ({
  socket: state.auth.socket,
});

export default connect(mapStateToProps)(Rooms);
