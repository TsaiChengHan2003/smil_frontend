import { Suspense, useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Loader } from "react-feather";

import PrivateRoute from "./private-route.jsx";
import { LocalStorageProvider } from "../contexts/LocalStorageContext";
import { LoadingProvider } from "../hooks/useLoading";
import { routes } from "./layouts-routes.jsx";
import { authRoutes } from "./auth-routs.jsx";
import AppLayout from "../components/app.jsx";

const MainRoutes = () => {
  const [currentUser, setCurrentUser] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    setAuthenticated(JSON.parse(localStorage.getItem("authenticated")));
    const layout = localStorage.getItem("layout_version");

    document.body.classList.add(layout);
    console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
    console.disableYellowBox = true;

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <>
      <LocalStorageProvider>
        <LoadingProvider>
          <BrowserRouter basename="/">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<PrivateRoute />}>
                  {currentUser !== null || authenticated || true ? (
                    <>
                      <Route exact path={`${process.env.PUBLIC_URL}`} element={<Navigate to={`${process.env.PUBLIC_URL}/dashboard/index`} />} />
                      <Route exact path={"/"} element={<Navigate to={`${process.env.PUBLIC_URL}/dashboard/index`} />} />
                    </>
                  ) : (
                    ""
                  )}
                  {routes.map(({ path, Component }, i) => (
                    <Route element={<AppLayout />} key={i}>
                      <Route exact path={path} element={Component} />
                    </Route>
                  ))}
                </Route>

                {authRoutes.map(({ path, Component }, i) => (
                  <Route exact path={path} element={Component} key={i}/>
                ))}
              </Routes>
            </Suspense>
          </BrowserRouter>
        </LoadingProvider>
      </LocalStorageProvider>
    </>

  );
};

export default MainRoutes;