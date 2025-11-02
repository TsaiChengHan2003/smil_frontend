import '@styles/main.scss'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Footer } from '@/components/common/Footer'
import { Header } from '@/components/common/Header'
import { authRoutes } from '@/routes/auth-routs'
import { routes } from '@/routes/layouts-routes'
import PrivateRoute from '@/routes/private-route'
import Error404 from '@/pages/errors/error404'

export default function App() {
  return (
    <>
      <Header />
      <main className="app-main">
        <Routes>
          {/* 公開路由 */}
          {authRoutes.map(({ path, Component }, i) => (
            <Route key={`auth-${i}`} path={path} element={<Component />} />
          ))}
          
          {/* 受保護的路由 */}
          <Route path="/*" element={<PrivateRoute />}>
            {routes.map(({ path, Component }, i) => (
              <Route key={`route-${i}`} path={path} element={<Component />} />
            ))}
          </Route>
          
          {/* 404 頁面 */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
