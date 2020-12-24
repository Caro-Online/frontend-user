import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { getUserIdFromStorage } from '../../utils/utils';

export default function PrivateRoute({ children, ...rest }) {
  const userId = getUserIdFromStorage();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        userId ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
