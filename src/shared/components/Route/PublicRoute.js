import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

function PublicRoute({ isAuthenticated, children, ...rest }) {
  console.log(isAuthenticated)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isAuthenticated ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: '/',
                state: { from: location },
              }}
            />
          )
      }
    />
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

export default connect(mapStateToProps)(PublicRoute);
