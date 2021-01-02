import io from "socket.io-client";

let socket;

export const initSocket = (userId) => {
  socket = io("http://localhost:4000", { query: { userId } });
  console.log(socket);
  return socket;
};

export const getSocket = async () => {
  // if (!socket) {
  //   throw new Error('Socket not defined');
  // }
  return await socket;
};
