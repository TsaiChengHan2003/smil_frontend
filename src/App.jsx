import '@styles/main.scss'

import { Footer } from '@/components/common/Footer'
import { Header } from '@/components/common/Header'
import { LoadingProvider } from '@/hooks/useLoading'

export default function App() {
  return (
    <>
      <LoadingProvider>
        <Header />
        <Footer />
      </LoadingProvider>
    </>
  )
}
