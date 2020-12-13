//Library
import React, { useState, useEffect } from 'react';
import { List, Avatar, Tooltip, Spin } from 'antd';
import { SmileTwoTone, FrownTwoTone, LoadingOutlined } from '@ant-design/icons';
import _ from 'lodash';

//Others
import 'antd/dist/antd.css';
import './AllUser.css';
import { API } from '../../../../config';
import { getSocket } from '../../../../shared/utils/socket.io-client';

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

const AllUser = (props) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
          itemLayout="horizontal"
          dataSource={users}
          renderItem={(user) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title={<div onClick={() => {}}>{user.name}</div>}
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
