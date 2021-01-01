import { API } from "../../config";
import axios from "axios";
import { getTokenFromStorage } from "../../shared/utils/utils";

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
const getRandomRoom = () => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get(`${API}/room/random`, config);
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
  return axios.put(
    `${API}/room/${roomId}/join-player-queue`,
    { userId },
    config
  );
};

const joinRoomById = (roomId) => {};

const getCurrentMatchByIdOfRoom = (roomId) => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get(`${API}/match/room/${roomId}`, config);
};

const addMove = (matchId, index, xIsNext) => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.post(
    `${API}/match/addmove`,
    { matchId, index, xIsNext },
    config
  );
};

const createMatch = (roomId, players) => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.post(`${API}/match`, { roomId, players }, config);
};

const getMatchById = (matchId) => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get(`${API}/match/${matchId}`, config);
};

const api = {
  getAllRoom,
  getRoomInfoById,
  joinRoom,
  joinPlayerQueue,
  outRoom,
  getCurrentMatchByIdOfRoom,
  addMove,
  createMatch,
  getMatchById,
  getRandomRoom,
};

export default api;
