import {
  login,
  updateStatusToOnline,
  signinWithGoogle,
  signinWithFacebook,
} from '../../domain/user/apiUser';
import * as actionTypes from './actionTypes';

const processResponseWhenLoginSuccess = (dispatch, response) => {
  if (response.data) {
    const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('expirationDate', expirationDate);
    localStorage.setItem('userId', response.data.userId);
    localStorage.setItem('userName', response.data.userName);
    dispatch(authSuccess(response.data.accessToken, response.data.userId));
    dispatch(checkAuthTimeout(3600));
  }
};

const processErrWhenLoginFail = (dispatch, err) => {
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
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
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
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
        updateStatusToOnline(userId)
          .then((response) => {
            console.log('Updated status');
          })
          .catch((error) => console.log(error));
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