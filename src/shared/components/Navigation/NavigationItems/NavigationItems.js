import React, { useState } from 'react';
import { Menu } from 'antd';
import { connect } from 'react-redux';

import NavigationItem from './NavigationItem/NavigationItem';
import './NavigationItems.css';

const NavigationItems = (props) => {
  const [current, setCurrent] = useState('login');
  const { isAuthenticated } = props;

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  let content = (
    <>
      <NavigationItem link="/login" key="login">
        Login
      </NavigationItem>
      <NavigationItem link="/register" key="register">
        Register
      </NavigationItem>
    </>
  );

  if (isAuthenticated) {
    content = (
      <>
        <NavigationItem link="/all-user" key="all-user">
          All Users
        </NavigationItem>
        <NavigationItem link="/logout" key="logout">
          Logout
        </NavigationItem>
      </>
    );
  }
  return (
    <Menu
      mode="horizontal"
      onClick={handleClick}
      selectedKeys={[current]}
      className="navigation-items"
    >
      {content}
    </Menu>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps, null)(NavigationItems);
