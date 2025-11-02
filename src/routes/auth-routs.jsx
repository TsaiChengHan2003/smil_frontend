import Login from "../auth/Login";
import Error404 from "../pages/errors/error404";
import ResetPassword from "../auth/resetPassword";

export const authRoutes = [
  { path: "/", Component: Login },
  { path: "/resetpassword/:webCode", Component: ResetPassword },
  { path: "/pages/errors/error404", Component: Error404 },
  // { path: "/pages/errors/callback", Component: Callback },
];