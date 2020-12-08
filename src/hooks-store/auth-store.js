import { initStore } from './store';

const authLogout = (curState) => {
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
  localStorage.removeItem('experationDate');

  const newAuth = { ...curState.auth };
  newAuth.userId = null;
  newAuth.token = null;
  return { auth: newAuth };
};

const authSuccess = (curState, payload) => {
  localStorage.setItem('userId', payload.userId);
  localStorage.setItem('token', payload.token);
  localStorage.setItem(
    'experationDate',
    new Date(new Date().getTime() + 3600 * 1000)
  );

  const newAuth = { ...curState.auth };
  newAuth.userId = payload.userId;
  newAuth.token = payload.token;
  setTimeout(() => {
    authLogout(curState);
  }, 3600 * 1000);
  return { auth: newAuth };
};

const authAutoLogin = (curState) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return authLogout(curState);
  } else {
    const experationDate = new Date(localStorage.getItem('experationDate'));
    if (experationDate > new Date()) {
      const userId = localStorage.getItem('userId');
      return authSuccess(curState, { userId: userId, token: token });
    } else {
      return authLogout(curState);
    }
  }
};

const configureAuthStore = () => {
  const actions = {
    AUTH_SUCCESS: (curState, payload) => {
      return authSuccess(curState, payload);
    },
    AUTH_LOGOUT: (curState) => {
      return authLogout(curState);
    },
    AUTH_AUTO_LOGIN: (curState) => {
      return authAutoLogin(curState);
    },
  };

  initStore(actions, {
    auth: {
      userId: null,
      token: null,
    },
  });
};

export default configureAuthStore;
