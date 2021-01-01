import { getSocket } from "src/shared/utils/socket.io-client";
const invitationSocketOn = (cb) => {
  const socket = getSocket();
  socket.on("receivedInvitation", (data) => cb(null, data));
};
const invitationSocketEmit = (data) => {
  const socket = getSocket();
  socket.emit("invitation", data);
};

const invitationSocket = (data, cb) => {
  const socket = getSocket();
  socket.on("receivedInvitation", (data) => cb(null, data));
  socket.emit("invitation", data);
};
export { invitationSocketOn, invitationSocketEmit, invitationSocket };
