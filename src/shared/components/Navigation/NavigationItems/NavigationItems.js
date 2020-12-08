import React, { useState } from 'react';
import { Menu } from 'antd';

import NavigationItem from './NavigationItem/NavigationItem';
import './NavigationItems.css';
import { useStore } from '../../../../hooks-store/store';

const NavigationItems = (props) => {
  const [current, setCurrent] = useState('login');
  const globalState = useStore()[0];
  const isAuthenticated = globalState.auth.token !== null;

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

export default NavigationItems;
