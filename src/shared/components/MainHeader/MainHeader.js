import React from 'react';
import { Layout, Avatar } from 'antd';
import { Link } from 'react-router-dom';

import NavigationItems from '../Navigation/NavigationItems/NavigationItems';
import caroLogo from '../../assets/images/caro.jpg';
import 'antd/dist/antd.css';
import './MainHeader.css';

const { Header } = Layout;

const MainHeader = (props) => {
  return (
    <Header className='main-header'>
      <Link to="/" className='container-logo'>
        <Avatar src={caroLogo} className='logo' />
        CaroOnline
      </Link>
      <NavigationItems />
    </Header>
  );
};

export default MainHeader;
