import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Menu, Button, Dropdown, Avatar, Image } from "antd";
import { CaretDownOutlined, LogoutOutlined } from "@ant-design/icons";

import "./NavigationItems.css";
import NavigationItem from "./NavigationItem/NavigationItem";

const menu = (
  <Menu>
    <Menu.Item>
      <a
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        rel="noopener noreferrer"
        href="/logout"
      >
        <LogoutOutlined />
        Logout
      </a>
    </Menu.Item>
  </Menu>
);
const NavigationItems = (props) => {
  const [current, setCurrent] = useState("login");
  const { isAuthenticated } = props;

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  let content = (
    <>
      <Link to="/login">
        <Button
          type="primary"
          style={{
            marginRight: "4px",
          }}
        >
          Login
        </Button>
      </Link>
      <Link to="/register">
        <Button type="primary" ghost>
          Register
        </Button>
      </Link>
    </>
  );

  if (isAuthenticated) {
    content = (
      <>
        <Link to="/profile">
          <Button
            size="large"
            shape="round"
            type="primary"
            style={{
              marginRight: "4px",
              padding: "4px 19px 4px  4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar
              style={{
                color: "#f56a00",
                backgroundColor: "#fde3cf",
                height: "30px",
                marginRight: "4px",
              }}
            >
              U
            </Avatar>
            User name
          </Button>
        </Link>
        <Dropdown overlay={menu} placement="bottomRight" arrow>
          <Button
            size="large"
            shape="circle"
            type="gray"
            style={{
              marginRight: "4px",
              paddingTop: "0px",
            }}
          >
            <CaretDownOutlined />
          </Button>
        </Dropdown>
      </>
    );
  }
  return <div className="navigation-items">{content}</div>;
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps, null)(NavigationItems);
