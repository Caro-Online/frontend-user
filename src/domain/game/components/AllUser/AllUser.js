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
} from 'antd';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { ImUserPlus } from 'react-icons/im';
import { RiFileUserFill } from 'react-icons/ri';
import { FaGamepad } from 'react-icons/fa';
import _ from 'lodash';

//Others
import 'antd/dist/antd.css';
import './AllUser.css';
import { API } from '../../../../config';
import { getSocket } from '../../../../shared/utils/socket.io-client';

let socket;
// const abortController = new AbortController();

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

const AllUser = (props) => {
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      // signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((response) => {
        if (!response.success) {
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setUsers(response.users);
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
    // return () => {
    //   abortController.abort();
    // };
  }, []);

  let content = null;
  if (users) {
    content = (
      <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(user) => (
          <List.Item
            onClick={() => {
              console.log('Helo');
            }}
            className="list-item-user"
          >
            {user.isOnline ? (
              <Popover
                placement="left"
                content={
                  <div className="popover-container">
                    <Row gutter={8} style={{ width: '100%', height: '100%' }}>
                      <Col span={8}>
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
                      <Col span={16} style={{ width: '100%', height: '100%' }}>
                        <h3>{user.name}</h3>
                        <Row>
                          <Col span={12}>
                            <Statistic
                              title="Số trận đã chơi"
                              value={112893}
                              prefix={<FaGamepad />}
                            />
                          </Col>
                          <Col span={12}>
                            <Statistic
                              title="Tỉ lệ thắng"
                              value={11.28}
                              precision={2}
                              valueStyle={{ color: '#3f8600' }}
                              suffix="%"
                            />
                          </Col>
                        </Row>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '8px',
                          }}
                        >
                          <Button
                            type="primary"
                            shape="round"
                            style={{ marginRight: '8px' }}
                            icon={<ImUserPlus style={{ marginRight: '8px' }} />}
                          >
                            Mời vào chơi
                          </Button>
                          <Button
                            type="default"
                            shape="round"
                            icon={
                              <RiFileUserFill style={{ marginRight: '8px' }} />
                            }
                          >
                            Thông tin chi tiết
                          </Button>
                        </div>
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
                  title={<div onClick={() => { }}>{user.name}</div>}
                />
              </Popover>
            ) : (
                <Popover
                  placement="left"
                  content={
                    <div className="popover-container">
                      <Row gutter={8} style={{ width: '100%', height: '100%' }}>
                        <Col span={8}>
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
                        <Col span={16} style={{ width: '100%', height: '100%' }}>
                          <h3>{user.name}</h3>
                          <Row>
                            <Col span={12}>
                              <Statistic
                                title="Số trận đã chơi"
                                value={112893}
                                prefix={<FaGamepad />}
                              />
                            </Col>
                            <Col span={12}>
                              <Statistic
                                title="Tỉ lệ thắng"
                                value={11.28}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                suffix="%"
                              />
                            </Col>
                          </Row>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row-reverse',
                              alignItems: 'center',
                            }}
                          >
                            <Button
                              type="default"
                              shape="round"
                              icon={
                                <RiFileUserFill style={{ marginRight: '8px' }} />
                              }
                            >
                              Thông tin chi tiết
                          </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  }
                  trigger="hover"
                >
                  <List.Item.Meta
                    avatar={
                      <Badge status="error" offset={[-5, 30]}>
                        <Avatar
                          shape="circle"
                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        />
                      </Badge>
                    }
                    title={<div onClick={() => { }}>{user.name}</div>}
                  />
                </Popover>
              )}
          </List.Item>
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

export default AllUser;
