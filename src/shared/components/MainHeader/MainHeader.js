import React from 'react';
import { Layout, Avatar } from 'antd';
import { Link } from 'react-router-dom';

import NavigationItems from '../Navigation/NavigationItems/NavigationItems';
import caroLogo from '../../assets/images/caro.jpg';
import 'antd/dist/antd.css';
import classes from './MainHeader.module.css';

const { Header } = Layout;

const MainHeader = (props) => {
  return (
    <Header className={classes.MainHeader}>
      <Link to="/" className={classes.ContainerLogo}>
        <Avatar src={caroLogo} className={classes.Logo} />
        CaroOnline
      </Link>
      <NavigationItems />
    </Header>
  );
};

export default MainHeader;
