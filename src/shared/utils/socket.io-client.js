import io from "socket.io-client";
import { API } from 'src/config'

let socket;

export const initSocket = (userId) => {
  socket = io(API, { query: { userId } });
  return socket;
};

export const getSocket = async () => {
  // if (!socket) {
  //   throw new Error('Socket not defined');
  // }
  return await socket;
};
