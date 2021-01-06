import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { ImUserPlus } from "react-icons/im";
// import { getSocket } from "../../../../shared/utils/socket.io-client";
import { invitationSocketEmit } from "./api";
import {
  getUsernameFromStorage,
  getUserIdFromStorage,
} from "src/shared/utils/utils";
import InvitationDialog from "./dialog";
const InvitationButton = ({ user, roomId }) => {
  const [isInviting, setIsInviting] = useState(false);
  const onInviteHandler = (cb) => {
    console.log("onInviteHandler");
    const invitedName = getUsernameFromStorage();
    const invitedId = getUsernameFromStorage();
    const receivedId = user?._id;
    const receivedName = user?.name;
    invitationSocketEmit({
      roomId,
      invitedId,
      invitedName,
      receivedId,
      receivedName,
    });
  };
  return (
    <div>
      <Button
        type="ghost"
        shape="round"
        style={{ marginRight: "8px" }}
        icon={<ImUserPlus style={{ marginRight: "8px" }} />}
        onClick={onInviteHandler}
      >
        Mời chơi
      </Button>
    </div>
  );
};
export default InvitationButton;
export { InvitationDialog };
