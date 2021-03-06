import axios from "axios";
import { API } from "../../config";
import { getTokenFromStorage } from "../../shared/utils/utils";

export const login = (user) => {
  return axios.post(`${API}/user/auth/login`, user);
};

export const signinWithGoogle = (idToken) => {
  return axios.post(`${API}/user/auth/login-google`, { idToken });
};
export const signinWithFacebook = (userId, accessToken) => {
  return axios.post(`${API}/user/auth/login-facebook`, {
    userId,
    accessToken,
  });
};

export const updateStatusToOnline = (userId) => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.put(`${API}/user/${userId}/update-status`, null, config);
};

export const getUserById = (userId) => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get(`${API}/user/${userId}`, config);
};

export const getOnlineUsers = () => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get(`${API}/user`, config);
};
// export const updateStatusToOnline = (userId) => {
//   return axios.put(`${API}/user/${userId}/update-status`);
// };

export const getMatchHistoryByUserId = (userId) => {
  const token = getTokenFromStorage();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get(`${API}/match/user/${userId}`, config);
};
