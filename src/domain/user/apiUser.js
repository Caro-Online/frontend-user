import axios from 'axios';
import { API } from '../../config';

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
  return axios.put(`${API}/user/${userId}/update-status`);
};

export const getUserById = (userId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios.get(`${API}/user/${userId}`, config);
}
// export const updateStatusToOnline = (userId) => {
//   return axios.put(`${API}/user/${userId}/update-status`);
// };
