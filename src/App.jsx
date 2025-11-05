import '@styles/main.scss'
import { Routes, Route } from 'react-router-dom'
import { Footer } from '@/components/common/Footer'
import { Header } from '@/components/common/Header'
import { useEffect } from 'react'
import Index from '@/pages/index'
import { useLoading } from './hooks/useLoading'

export default function App() {
  const {setLoading} = useLoading();

  useEffect(() => {
    setLoading(true);
    localStorage.setItem('user', 'anonymous');

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  },[]);

  return (
    <>
      <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </main>
      <Footer />
    </>
  )
}