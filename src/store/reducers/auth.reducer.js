import * as actionTypes from '../actions/actionTypes';
import updateObject from '../../shared/utils/updateObject';
import { initSocket } from '../../shared/utils/socket.io-client';

const initialState = {
  token: null,
  userId: null,
  socket: null,
  error: null,
  loading: false,
  authRedirectPath: null,
  isAutoLogin: true,
};

const authStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    userId: action.userId,
    error: null,
    loading: false,
  });
};

const authFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
    userId: null,
    socket: null,
    loading: false,
    authRedirectPath: null,
  });
};

const authClearError = (state, action) => {
  return updateObject(state, { error: null });
};

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, { authRedirectPath: '/' });
};

const resetAuthRedirectPath = (state, action) => {
  return updateObject(state, { authRedirectPath: null });
};

const setSocket = (state, action) => {
  return updateObject(state, { socket: initSocket(action.userId) });
};

const setIsAutoLogin = (state, action) => {
  return updateObject(state, { isAutoLogin: action.value });
};

const removeSocket = (state, action) => {
  return updateObject(state, { socket: null });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.AUTH_CLEAR_ERRROR:
      return authClearError(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    case actionTypes.RESET_AUTH_REDIRECT_PATH:
      return resetAuthRedirectPath(state, action);
    case actionTypes.SET_SOCKET:
      return setSocket(state, action);
    case actionTypes.REMOVE_SOCKET:
      return removeSocket(state, action);
    case actionTypes.SET_IS_AUTO_LOGIN:
      return setIsAutoLogin(state, action);
    default:
      return state;
  }
};

export default reducer;
