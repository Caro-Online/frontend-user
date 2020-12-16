import React from "react";
import { Layout, Avatar } from "antd";
import { Link } from "react-router-dom";

import NavigationItems from "../Navigation/NavigationItems/NavigationItems";
import caroLogo from "../../assets/images/caro.jpg";
import "antd/dist/antd.css";
import "./MainHeader.css";
import { Menu } from "antd";
const { Header } = Layout;

const MainHeader = (props) => {
  return (
    <Header>
      <Link to="/" className="container-logo">
        <div className="logo">
          <Avatar src={caroLogo} size="36" />
          <span style={{ marginLeft: "8px" }}>CaroOnline</span>
        </div>
      </Link>
      {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu> */}

      <NavigationItems />
    </Header>
  );
};

export default MainHeader;
