import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const login = localStorage.getItem("login");

  return login ? <Outlet /> : <Navigate exact to={`${process.env.PUBLIC_URL}/`} />;
};

export default PrivateRoute;