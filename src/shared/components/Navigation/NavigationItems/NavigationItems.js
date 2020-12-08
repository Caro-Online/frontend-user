import React, { useState } from 'react';
import { Menu } from 'antd';

import NavigationItem from './NavigationItem/NavigationItem';
import './NavigationItems.css';


const NavigationItems = (props) => {
  const [current, setCurrent] = useState('login');

  const handleClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  // let content = (
  //   <>

  //     {/* <NavigationItem link="/test" key="test" exact>
  //       Test
  //     </NavigationItem>  */}
  //   </>
  // );
  return (
    <Menu mode="horizontal" onClick={handleClick} selectedKeys={[current]} className='navigation-items'>
      <NavigationItem link="/login" key="login">
        Login
      </NavigationItem>
      <NavigationItem link="/register" key="register" >
        Register
      </NavigationItem>
    </Menu>
    // <Menu mode="horizontal" onClick={handleClick} selectedKeys={[current]}>
    //   {content}
    // </Menu>
  );
};

export default NavigationItems;
