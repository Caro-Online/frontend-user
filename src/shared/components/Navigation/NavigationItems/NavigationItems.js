import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Button, Dropdown, Avatar } from 'antd';
import { CaretDownOutlined, LogoutOutlined } from '@ant-design/icons';

import './NavigationItems.css';
import {
  getUsernameFromStorage,
  getUserImageUrlFromStorage,
} from '../../../utils/utils';

const menu = (
  <Menu>
    <Menu.Item>
      <a
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        rel="noopener noreferrer"
        href="/logout"
      >
        <LogoutOutlined />
        Đăng xuất
      </a>
    </Menu.Item>
  </Menu>
);
const NavigationItems = (props) => {
  const { isAuthenticated } = props;

  let content = (
    <>
      <Link to="/login">
        <Button
          type="primary"
          style={{
            marginRight: '4px',
          }}
        >
          Đăng nhập
        </Button>
      </Link>
      <Link to="/register">
        <Button type="primary" ghost>
          Đăng ký
        </Button>
      </Link>
    </>
  );

  if (isAuthenticated) {
    content = (
      <>
        <Link to="/profile">
          <Button
            size="large"
            shape="round"
            type="primary"
            style={{
              marginRight: '4px',
              padding: '4px 19px 4px  4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {getUserImageUrlFromStorage() ? (
              <Avatar src={getUserImageUrlFromStorage()} />
            ) : (
              <Avatar
                style={{
                  color: '#f56a00',
                  backgroundColor: '#fde3cf',
                  height: '30px',
                  marginRight: '4px',
                }}
              >
                {getUsernameFromStorage().split(' ')[0][0]}
              </Avatar>
            )}
            {getUsernameFromStorage()}
          </Button>
        </Link>
        <Dropdown overlay={menu} placement="bottomRight" arrow>
          <Button
            size="large"
            shape="circle"
            type="gray"
            style={{
              marginRight: '4px',
              paddingTop: '0px',
            }}
          >
            <CaretDownOutlined />
          </Button>
        </Dropdown>
      </>
    );
  }
  return <div className="navigation-items">{content}</div>;
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps, null)(NavigationItems);
