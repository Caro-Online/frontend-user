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
    <Header>
      <Link to="/" className="container-logo">
        <div className="logo">
          <Avatar src={caroLogo} size="36" />
          <span style={{ marginLeft: '8px' }}>CaroOnline</span>
        </div>
      </Link>

      <NavigationItems />
    </Header>
  );
};

export default MainHeader;
