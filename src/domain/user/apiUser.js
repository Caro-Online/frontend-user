import axios from 'axios';
import { API } from '../../config';

export const login = (user) => {
  return axios.post(`${API}/user/auth/login`, user);
};

export const signinWithGoogle = (tokenId) => {
  return axios.post(`${API}/user/auth/signin/google`, { tokenId });
};
export const signinWithFacebook = (userID, name, email, accessToken) => {
  return axios.post(`${API}/user/auth/signin/facebook`, {
    userID,
    name,
    email,
    accessToken,
  });
};

export const updateStatusToOnline = (userId) => {
  return axios.put(`${API}/user/${userId}/update-status`);
};
