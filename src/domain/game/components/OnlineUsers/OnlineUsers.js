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
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { ImUserPlus } from 'react-icons/im';
import { FaGamepad, FaCalendarAlt, FaTrophy } from 'react-icons/fa';
import _ from 'lodash';

//Others
import 'antd/dist/antd.css';
import './OnlineUsers.css';
import { API } from '../../../../config';
import { getSocket } from '../../../../shared/utils/socket.io-client';
import {
  getUserIdFromStorage,
  getTokenFromStorage,
} from '../../../../shared/utils/utils';

const { Text } = Typography;

let socket;

const modifyUsersStatus = (response, data, setUsers, isOnline) => {
  const modifyUsers = _.cloneDeep(response.users);
  const index = modifyUsers.findIndex(
    (user) => user._id.toString() === data.userId.toString()
  );
  const modifyUser = _.cloneDeep(modifyUsers[index]);
  modifyUser.isOnline = isOnline;
  modifyUsers[index] = modifyUser;
  setUsers(modifyUsers);
};

const OnlineUsers = (props) => {
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getTokenFromStorage()}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
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
          socket = getSocket();
          socket.on('user-online', (data) => {
            modifyUsersStatus(response, data, setUsers, true);
          });
          socket.on('user-offline', (data) => {
            console.log('Processing user offline event');
            modifyUsersStatus(response, data, setUsers, false);
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  let content = null;
  if (users) {
    content = (
      <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(user) => (
          <>
            {user.isOnline ? (
              <List.Item
                className="list-item-user"
                actions={[
                  <>
                    {user._id !== getUserIdFromStorage() ? (
                      <Button
                        type="ghost"
                        shape="round"
                        style={{ marginRight: '8px' }}
                        icon={<ImUserPlus style={{ marginRight: '8px' }} />}
                      >
                        Mời chơi
                      </Button>
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
                            <Avatar
                              size={96}
                              style={{
                                backgroundColor: '#87d068',
                              }}
                              icon={<UserOutlined />}
                            />
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
                                    user.matchHaveWon / user.matchHavePlayed
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
                        <Avatar
                          shape="circle"
                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        />
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

export default OnlineUsers;
