import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useStore } from '../../../../hooks-store/store';

const Logout = (props) => {
  const dispatch = useStore(false)[1];

  useEffect(() => {
    dispatch('AUTH_LOGOUT');
  }, [dispatch]);

  return <Redirect to="/" />;
};

export default Logout;
