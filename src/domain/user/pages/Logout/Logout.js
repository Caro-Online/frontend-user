import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  removeTokenFromStorage,
  removeExpirationDateFromStorage,
  removeUserFromStorage,
} from '../../../../shared/utils/utils';
import * as actions from '../../../../store/actions';

const Logout = (props) => {
  const { onLogout } = props;

  useEffect(() => {
    removeTokenFromStorage();
    removeExpirationDateFromStorage();
    removeUserFromStorage();
    onLogout();
  }, [onLogout]);

  return <Redirect to="/" />;
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(actions.logout()),
  };
};

export default connect(null, mapDispatchToProps)(Logout);
