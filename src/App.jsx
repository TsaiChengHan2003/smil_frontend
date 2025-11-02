import '@styles/main.scss'
import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/common/Footer'
import { Header } from '@/components/common/Header'

export default function App() {
  return (
    <>
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
