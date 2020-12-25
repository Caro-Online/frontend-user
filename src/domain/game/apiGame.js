import { API } from '../../config';
import axios from 'axios';
import { getTokenFromStorage } from '../../shared/utils/utils';

const getAllRoom = () => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get(`${API}/room`, config);
};

const getRoomInfoById = (id) => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get(`${API}/room/${id}`, config);
};

const joinRoom = (userId, roomId) => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.put(`${API}/room/${roomId}/join`, { userId }, config);
};
const outRoom = (userId, roomId) => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.put(`${API}/room/${roomId}/out`, { userId }, config);
};

const joinPlayerQueue = (userId, roomId) => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.put(`${API}/room/${roomId}/join-player-queue`, { userId }, config);
};

const joinRoomById = (roomId) => { };

const api = {
  getAllRoom,
  getRoomInfoById,
  joinRoom,
  joinPlayerQueue,
  outRoom,
};

export default api;
