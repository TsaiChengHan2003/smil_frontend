import Login from "../auth/Login";
import Error404 from "../pages/errors/error404";
import ResetPassword from "../auth/resetPassword";

export const authRoutes = [
  { path: `${process.env.PUBLIC_URL}/`, Component: <Login /> },
  { path: `${process.env.PUBLIC_URL}/resetpassword/:webCode`, Component: <ResetPassword /> },
  { path: `${process.env.PUBLIC_URL}/pages/errors/error404`, Component: <Error404 /> },
  // { path: `${process.env.PUBLIC_URL}/pages/errors/callback`, Component: <Callback /> },
];