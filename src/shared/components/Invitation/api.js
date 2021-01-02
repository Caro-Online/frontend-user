import { initSocket } from "src/shared/utils/socket.io-client";
const socket = initSocket();
const invitationSocketOn = (cb) => {
  socket.on("receivedInvitation", (data) => cb(null, data));
};
const invitationSocketEmit = (data) => {
  socket.emit("invitation", data);
};

const invitationSocket = async (data, cb) => {
  console.log(`invitationSocket`, socket);
  socket.on("receivedInvitation", (data) => cb(null, data));
  socket.emit("invitation", data);
};
export { invitationSocketOn, invitationSocketEmit, invitationSocket };
