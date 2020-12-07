import React from 'react';
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';

// import 'antd/dist/antd.css';
import classes from './NavigationItem.module.css';

const NavigationItem = (props) => {
  //className={classes.NavigationItem}
  return (
    <Menu.Item key={props.key} className={classes.NavigationItem}>
      <NavLink
        to={props.link}
        exact={props.exact}
        activeClassName={classes.active}
      >
        {props.children}
      </NavLink>
    </Menu.Item>
    // <Menu.Item key={props.key}>
    //   <NavLink
    //     to={props.link}
    //     exact={props.exact}
    //     // activeClassName={classes.active}
    //   >
    //     {props.children}
    //   </NavLink>
    // </Menu.Item>
  );
};

export default NavigationItem;
