import React from 'react';
import { Header } from 'antd/lib/layout/layout';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';

import caroLogo from '../../assets/images/caro.jpg';
import classes from './MainHeader.module.css';

const MainHeader = (props) => {
  return (
    <Header className={classes.MainHeader}>
      <Link to="/" className={classes.ContainerLogo}>
        <Avatar
          src={caroLogo}
          className={classes.Logo}
          shape="circle"
        />
        CaroOnline
      </Link>
    </Header>
  );
};

export default MainHeader;
