import '@styles/main.scss'
import { Routes, Route } from 'react-router-dom'
import { Footer } from '@/components/common/Footer'
import { Header } from '@/components/common/Header'
import { useEffect } from 'react'
import Index from '@/pages/index'
import { useLoading } from './hooks/useLoading'
import About from './pages/about'
import Member from './pages/member'
import News from './pages/news/news'
import NewsDetail from './pages/news/newsDetail'
import ConferenceDetail from './pages/news/newsConferenceDetail'
import Research from './pages/research/research'
import ResearchDetail from './pages/research/researchDetail'
import Life from './pages/life'
import Achievements from './pages/achievements'
import Internal from './pages/internal'

export default function App() {
  const {setLoading} = useLoading();

  useEffect(() => {
    setLoading(true);
    // localStorage.setItem('user', 'anonymous');
    localStorage.setItem('user', 'manager');


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
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/news/conference/:id" element={<ConferenceDetail />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/:url" element={<ResearchDetail />} />
          <Route path="/life" element={<Life />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/internal" element={<Internal />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}