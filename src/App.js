import React, { Suspense, lazy, useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import "./App.css";
import * as actions from "./store/actions";
import {
  getUsernameFromStorage,
  getUserIdFromStorage,
} from "src/shared/utils/utils";

import { useHistory } from "react-router-dom";
import PrivateRoute from "./shared/components/Route/PrivatetRoute";
import PublicRoute from "./shared/components/Route/PublicRoute";
import MainHeader from "./shared/components/MainHeader/MainHeader";
import Home from "./domain/home/pages/Home";
import GamePage from "./domain/game/pages/GamePage/GamePage";
import History from "./domain/user/pages/History";
import { invitationSocket } from "src/shared/components/Invitation/api";
import { InvitationDialog } from "src/shared/components/Invitation";
require("dotenv").config();
const Logout = lazy(() => import("./domain/user/pages/Logout/Logout"));
const Register = lazy(() => import("./domain/user/pages/Register/Register"));
const ConfirmRegistration = lazy(() =>
  import("./domain/user/pages/ConfirmRegistration/ConfirmRegistration")
);
const Login = lazy(() => import("./domain/user/pages/Login/Login"));
const ResetPassword = lazy(() =>
  import("./domain/user/pages/ResetPassword/ResetPassword")
);
const UpdatePassword = lazy(() =>
  import("./domain/user/pages/UpdatePassword/UpdatePassword")
);
const Rooms = lazy(() => import("./domain/game/pages/Rooms/Rooms"));

const { Content } = Layout;
const App = (props) => {
  const { isAuthenticated, onTryAutoLogin, socket, isAutoLogin } = props;
  const [showInvitation, setShowInvitation] = useState(false);
  const [invitedData, setInvitedData] = useState();
  const history = useHistory();
  useEffect(() => {
    onTryAutoLogin();
  }, [onTryAutoLogin]);

  useEffect(() => {
    if (socket) {
      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, socket]);

  const invitationIO = () => {
    const data = {
      invitedId: getUserIdFromStorage(),
      invitedName: getUsernameFromStorage(),
    };
    invitationSocket(data, (err, data) => {
      console.log(`invitationSocket`, data);
      setShowInvitation(true);
      setInvitedData(data);
    });
  };
  if (isAuthenticated) {
    invitationIO();
  }
  // console.log(1, `isAuthenticated`, isAuthenticated);
  // console.log(`REACT_APP_API_URL`, process.env.REACT_APP_API_URL);
  const onCancelInvitation = () => {
    setShowInvitation(false);
  };
  const onJoinRoom = (roomId) => {
    history.push(`room/${roomId}`);
    setShowInvitation(false);
  };
  let routes = (
    <Switch>
      <Route path="/" exact component={Home} />
      <PublicRoute path="/register" exact>
        <Register />
      </PublicRoute>
      <PublicRoute path="/confirm-registration/:emailVerifyToken" exact>
        <ConfirmRegistration />
      </PublicRoute>
      <PublicRoute path="/login" exact>
        <Login />
      </PublicRoute>
      <PublicRoute path="/reset-password" exact>
        <ResetPassword />
      </PublicRoute>
      <PublicRoute path="/reset-password/:resetToken" exact>
        <UpdatePassword />
      </PublicRoute>
      <PrivateRoute path="/logout" exact>
        <Logout />
      </PrivateRoute>
      <PrivateRoute path="/history" exact>
        <History />
      </PrivateRoute>
      <PrivateRoute path="/rooms" exact>
        <Rooms />
      </PrivateRoute>
      <PrivateRoute path="/room/:roomId" exact>
        <GamePage />
      </PrivateRoute>
      {/* <Redirect to="/" /> */}
    </Switch>
  );

  if (isAutoLogin) {
    routes = <LoadingOutlined style={{ fontSize: 100 }} spin />;
  }

  return (
    <Layout>
      <MainHeader />
      <InvitationDialog
        value={showInvitation}
        data={invitedData}
        onCancel={onCancelInvitation}
        onJoin={onJoinRoom}
      />
      <Suspense fallback={<LoadingOutlined style={{ fontSize: 100 }} spin />}>
        <Content style={{ backgroundColor: "white", display: "contents" }}>
          {routes}
        </Content>
      </Suspense>
    </Layout>
  );
};
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    isAutoLogin: state.auth.isAutoLogin,
    socket: state.auth.socket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoLogin: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
