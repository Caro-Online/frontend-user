//Library
import React, { useState, useEffect } from 'react';
import { List, Avatar, Button, Spin, Badge, Popover } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ImUserPlus } from 'react-icons/im';
import { RiFileUserFill } from 'react-icons/ri';
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

  const popOverContent1 = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button
        type="primary"
        shape="round"
        icon={<ImUserPlus style={{ marginRight: '8px' }} />}
      >
        Mời vào chơi
      </Button>
      <Button
        type="default"
        shape="round"
        style={{ marginTop: '8px' }}
        icon={<RiFileUserFill style={{ marginRight: '8px' }} />}
      >
        Thông tin chi tiết
      </Button>
    </div>
  );

  const popOverContent2 = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button
        type="default"
        shape="round"
        icon={<RiFileUserFill style={{ marginRight: '8px' }} />}
      >
        Thông tin chi tiết
      </Button>
    </div>
  );

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
                content={popOverContent1}
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
                  title={<div onClick={() => {}}>{user.name}</div>}
                />
              </Popover>
            ) : (
              <Popover
                placement="left"
                content={popOverContent2}
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
                  title={<div onClick={() => {}}>{user.name}</div>}
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
