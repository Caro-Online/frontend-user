import React, { useState, useEffect } from 'react';
import { List, Avatar, Tooltip, Spin } from 'antd';
import { SmileTwoTone, FrownTwoTone, LoadingOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import _ from 'lodash';

import 'antd/dist/antd.css';
import './AllUser.css';

let socket;

const AllUser = (props) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function doFetchAllUsers() {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:4000/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const response = await res.json();
        if (!response.success) {
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setUsers(response.users);
          socket = io('http://localhost:4000');
          socket.on('user-online', (data) => {
            const modifyUsers = _.cloneDeep(response.users);
            const index = modifyUsers.findIndex(
              (user) => user._id.toString() === data.userId.toString()
            );
            const modifyUser = _.cloneDeep(modifyUsers[index]);
            modifyUser.isOnline = true;
            modifyUsers[index] = modifyUser;
            setUsers(modifyUsers);
          });
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }

      return () => {
        socket.disconnect();
      };
    }

    doFetchAllUsers();
  }, []);

  return (
    <>
      {isLoading ? (
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
          className="center"
        />
      ) : (
        <List
          style={{ width: '30%', margin: '0 auto' }}
          itemLayout="horizontal"
          dataSource={users}
          renderItem={(user) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title={<a href="https://ant.design">{user.name}</a>}
              />
              {user.isOnline ? (
                <Tooltip title="Online">
                  <SmileTwoTone
                    className="online-offline-status"
                    twoToneColor="#52c41a"
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Offline">
                  <FrownTwoTone
                    className="online-offline-status"
                    twoToneColor="red"
                  />
                </Tooltip>
              )}
            </List.Item>
          )}
        />
      )}
    </>
  );
};

export default AllUser;
