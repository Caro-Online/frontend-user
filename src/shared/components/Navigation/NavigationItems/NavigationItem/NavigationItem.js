import React from 'react';
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';

import './NavigationItem.css';

const NavigationItem = (props) => {
  return (
    <Menu.Item
      {...props}
      key={props.key}
      className="navigation-item"
      style={{ textAlign: 'center' }}
    >
      <NavLink to={props.link} exact activeClassName="active">
        {props.children}
      </NavLink>
    </Menu.Item>
  );
};

export default NavigationItem;
