import React, { useState } from 'react';
import { Menu } from 'antd';

import NavigationItem from './NavigationItem/NavigationItem';
// import 'antd/dist/antd.css';
import classes from './NavigationItems.module.css';


const NavigationItems = (props) => {
  const [current, setCurrent] = useState('mail');

  const handleClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  let content = (
    <>
      <NavigationItem link="/login" key="login" exact>
        Login
      </NavigationItem>
      <NavigationItem link="/register" key="register" exact>
        Register
      </NavigationItem>
      {/* <NavigationItem link="/test" key="test" exact>
        Test
      </NavigationItem>  */}
    </>
  );
  return (
    <Menu mode="horizontal" onClick={handleClick} selectedKeys={[current]} className={classes.NavigationItems}>
      {content}
    </Menu>
    // <Menu mode="horizontal" onClick={handleClick} selectedKeys={[current]}>
    //   {content}
    // </Menu>
  );
};

export default NavigationItems;
