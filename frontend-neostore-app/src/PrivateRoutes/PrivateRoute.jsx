import React, { useEffect } from "react";
import { Navigate, Route, useNavigate, useLocation } from "react-router-dom";
import { isLogin } from "../utils";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const userAccessToken = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const NavigateToDashboard = () => {
    navigate("/");
  };
  return (
    <>
      {" "}
      {/* // Show the component only when the user is logged in
      // Otherwise,Navigate the user to /signin page */}
      <Route
        {...rest}
        render={(props) =>
          isLogin() ? <Component {...props} /> : <Navigate to="/login" />
        }
      />
      ;
    </>
  );
};
export default PrivateRoute;
