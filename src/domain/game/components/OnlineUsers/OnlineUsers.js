//Library
import React, { useState, useEffect } from 'react';
import {
  List,
  Avatar,
  Button,
  Spin,
  Badge,
  Popover,
  Row,
  Col,
  Statistic,
  Typography,
} from 'antd';
import { LeftOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { ImUserPlus } from 'react-icons/im';
import { FaGamepad, FaCalendarAlt, FaTrophy } from 'react-icons/fa';
import _ from 'lodash';
import InvitationButton from 'src/shared/components/Invitation';
//Others
import 'antd/dist/antd.css';
import './OnlineUsers.css';
import { API } from '../../../../config';
import {
  getUserIdFromStorage,
  getTokenFromStorage,
  getUserImageUrlFromStorage,
} from '../../../../shared/utils/utils';
import { connect } from 'react-redux';

const { Text } = Typography;

const modifyUsersStatus = (users, data, setUsers, status) => {
  let modifyUsers = _.cloneDeep(users);
  modifyUsers = modifyUsers.filter(
    (user) => user._id.toString() !== data.userId.toString()
  );
  setUsers(modifyUsers);
};

const newUserOnline = async (users, user, setUsers) => {
  let modifyUsers = _.cloneDeep(users);
  const Year = user.createdAt.split('-')[0];
  const createdMonth = user.createdAt.split('-')[1];
  const createdDay = user.createdAt.split('-')[2].split('T')[0];
  const date = [createdDay, createdMonth, Year];
  user = { ...user, createdAt: date.join('/') };
  modifyUsers = [...modifyUsers, user];
  setUsers(modifyUsers);
};

const OnlineUsers = ({ roomId, socket }) => {
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    let userOnlineListener, userOfflineListener;
    setIsLoading(true);
    fetch(`${API}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getTokenFromStorage()}`,
      },
    })
      .then((res) => res.json())
      .then(async (response) => {
        if (!response.success) {
          setIsLoading(false);
        } else {
          const users = response.users.map((user) => {
            const Year = user.createdAt.split('-')[0];
            const createdMonth = user.createdAt.split('-')[1];
            const createdDay = user.createdAt.split('-')[2].split('T')[0];
            const date = [createdDay, createdMonth, Year];
            return { ...user, createdAt: date.join('/') };
          });
          setIsLoading(false);
          setUsers(users);
          userOnlineListener = ({ user }) => {
            console.log('USERONLINE');
            newUserOnline(users, user, setUsers);
          };
          socket.on('user-online', userOnlineListener);
          userOfflineListener = (data) => {
            console.log('SUKIEN USEROFFLINE');
            modifyUsersStatus(users, data, setUsers, 'OFFLINE');
          };
          socket.on('user-offline', userOfflineListener);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    return () => {
      if (userOnlineListener) {
        socket.off('user-online', userOnlineListener);
      }
      if (userOfflineListener) {
        socket.off('user-offline', userOfflineListener);
      }
    };
  }, [socket]);

  let content = null;
  if (users) {
    content = (
      <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(user) => (
          <>
            {user.status === 'ONLINE' ? (
              <List.Item
                className="list-item-user"
                actions={[
                  <>
                    {user?._id !== getUserIdFromStorage() ? (
                      <InvitationButton
                        user={user}
                        roomId={roomId}
                      ></InvitationButton>
                    ) : null}
                  </>,
                ]}
              >
                <Popover
                  placement="left"
                  content={
                    <div className="popover-container">
                      <Row gutter={8} style={{ width: '100%', height: '100%' }}>
                        <Col span={6}>
                          <Badge
                            status="success"
                            offset={[-10, 80]}
                            style={{ width: '12px', height: '12px' }}
                          >
                            {user.imageUrl ? (
                              <Avatar
                                shape="circle"
                                size={96}
                                src={user.imageUrl}
                              />
                            ) : (
                              <Avatar
                                shape="circle"
                                size={96}
                                icon={<UserOutlined />}
                              />
                            )}
                          </Badge>
                        </Col>
                        <Col
                          span={18}
                          style={{ width: '100%', height: '100%' }}
                        >
                          <h3>{user.name}</h3>
                          <Row>
                            <Col span={14}>
                              <Statistic
                                title="Ngày tham gia"
                                value={Date.now()}
                                formatter={(value) => (
                                  <span>{user.createdAt}</span>
                                )}
                                prefix={<FaCalendarAlt fontSize={14} />}
                              />
                            </Col>
                            <Col span={10}>
                              <Statistic
                                title="Số cúp"
                                value={user.cup}
                                prefix={<FaTrophy />}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col span={14}>
                              <Statistic
                                title="Số trận đã chơi"
                                value={user.matchHavePlayed}
                                prefix={<FaGamepad />}
                              />
                            </Col>
                            <Col span={10}>
                              {user.matchHavePlayed === 0 ? (
                                <Statistic
                                  title="Tỉ lệ thắng"
                                  value={0}
                                  precision={2}
                                  valueStyle={{ color: '#3f8600' }}
                                  suffix="%"
                                />
                              ) : (
                                <Statistic
                                  title="Tỉ lệ thắng"
                                  value={
                                    (user.matchHaveWon / user.matchHavePlayed) *
                                    100
                                  }
                                  precision={2}
                                  valueStyle={{ color: '#3f8600' }}
                                  suffix="%"
                                />
                              )}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  }
                  trigger="hover"
                >
                  <List.Item.Meta
                    avatar={
                      <Badge status="success" offset={[-5, 30]}>
                        {user.imageUrl ? (
                          <Avatar shape="circle" src={user.imageUrl} />
                        ) : (
                          <Avatar shape="circle" icon={<UserOutlined />} />
                        )}
                      </Badge>
                    }
                    title={
                      <Text strong>
                        {user.name}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <FaTrophy
                            size="18"
                            style={{ marginRight: '8px', color: '#f5af19' }}
                          />
                          <Text strong>{user.cup}</Text>
                        </div>
                      </Text>
                    }
                  />
                </Popover>
              </List.Item>
            ) : null}
          </>
        )}
      />
    );
  }

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

const mapStateToProps = (state) => {
  return {
    socket: state.auth.socket,
  };
};

export default connect(mapStateToProps)(OnlineUsers);
