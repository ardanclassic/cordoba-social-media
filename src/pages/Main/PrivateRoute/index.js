import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  // /** cleanup from memory leaks */
  // useEffect(() => {
  //   return () => {};
  // }, []);

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
};

export default PrivateRoute;
