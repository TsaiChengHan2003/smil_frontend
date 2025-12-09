import '@styles/main.scss'
import { Routes, Route } from 'react-router-dom'
import { Footer } from '@/components/common/Footer'
import { Header } from '@/components/common/Header'
import { useEffect } from 'react'
import Index from '@/pages/index'
import { useLoading } from './hooks/useLoading'
import About from './pages/about'
import Member from './pages/member'
import News from './pages/news'
import Research from './pages/research'
import ResearchDetail from './pages/researchDetail'
import Life from './pages/life'
import Achievements from './pages/achievements'

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
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/members" element={<Member />} />
          <Route path="/news" element={<News />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/:url" element={<ResearchDetail />} />
          <Route path="/life" element={<Life />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}