import { initSocket, getSocket } from "src/shared/utils/socket.io-client";

const invitationSocketOn = async (cb) => {
  const socket = await getSocket();
  socket.on("receivedInvitation", (data) => cb(null, data));
};
const invitationSocketEmit = async (data) => {
  const socket = await getSocket();
  socket.emit("invitation", data);
};

const invitationSocket = async (data, cb) => {
  const socket = await getSocket();
  console.log(`invitationSocket`, socket);
  if (socket) {
    socket.on("receivedInvitation", (data) => cb(null, data));
    socket.emit("invitation", data);
  }
};
export { invitationSocketOn, invitationSocketEmit, invitationSocket };
