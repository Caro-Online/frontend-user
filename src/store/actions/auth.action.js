import {
  login,
  signinWithGoogle,
  signinWithFacebook,
  updateStatusToOnline,
} from '../../domain/user/apiUser';
import * as actionTypes from './actionTypes';
import {
  setTokenToStorage,
  setExpirationDateToStorage,
  setUserToStorage,
  getTokenFromStorage,
  getUserIdFromStorage,
  getExpirationDateFromStorage,
} from '../../shared/utils/utils';

const processResponseWhenLoginSuccess = (dispatch, response) => {
  if (response.data) {
    const { token, user } = response.data;
    const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
    setTokenToStorage(token);
    setExpirationDateToStorage(expirationDate);
    setUserToStorage(user);
    dispatch(authSuccess(token, user._id));
    dispatch(checkAuthTimeout(3600));
    dispatch(setAuthRedirectPath());
    console.log(user._id);
    dispatch(setSocket(user._id));
  }
};

const processErrWhenLoginFail = (dispatch, err) => {
  console.log(err.response);
  console.log(err);
  dispatch(authFail(err.response.data.message));
};

// export const setAuthRedirectPath = () => {
//   return {
//     type: actionTypes.SET_AUTH_REDIRECT_PATH,
//   };
// };

export const authClearError = () => {
  return {
    type: actionTypes.AUTH_CLEAR_ERRROR,
  };
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token,
    userId,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error,
  };
};

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (experationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, experationTime * 1000);
  };
};

export const authWithEmailAndPassword = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    login({ email, password })
      .then((response) => {
        processResponseWhenLoginSuccess(dispatch, response);
      })
      .catch((err) => {
        processErrWhenLoginFail(dispatch, err);
      });
  };
};

export const authWithGoogle = (idToken) => {
  return (dispatch) => {
    dispatch(authStart());
    signinWithGoogle(idToken)
      .then((response) => {
        processResponseWhenLoginSuccess(dispatch, response);
      })
      .catch((err) => {
        processErrWhenLoginFail(dispatch, err);
      });
  };
};

export const authWithFacebook = (userId, accessToken) => {
  return (dispatch) => {
    dispatch(authStart());
    signinWithFacebook(userId, accessToken)
      .then((response) => {
        processResponseWhenLoginSuccess(dispatch, response);
      })
      .catch((err) => {
        processErrWhenLoginFail(dispatch, err);
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = getTokenFromStorage();
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(getExpirationDateFromStorage());
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = getUserIdFromStorage();
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
        updateStatusToOnline(userId)
          .then((response) => {
            if (response.data.success) {
              console.log('Update status success');
            } else {
              console.log('Update status failed');
            }
          })
          .catch((error) => {
            console.log(error);
          });
        dispatch(setSocket(userId));
        console.log(userId);
        console.log('AutoLogin success');
        // let socket = initSocket(getUserIdFromStorage());
        // console.log('Emit user online');
        // socket.emit(
        //   'user-online',
        //   { userId: getUserIdFromStorage() },
        //   (error) => {
        //     if (error) {
        //       alert(error);
        //     }
        //   }
        // );
      }
    }
  };
};

export const setAuthRedirectPath = () => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
  };
};

export const resetAuthRedirectPath = () => {
  return {
    type: actionTypes.RESET_AUTH_REDIRECT_PATH,
  };
};

export const setSocket = (userId) => {
  return {
    type: actionTypes.SET_SOCKET,
    userId,
  };
};

export const removeSocket = () => {
  return {
    type: actionTypes.REMOVE_SOCKET,
  };
};
