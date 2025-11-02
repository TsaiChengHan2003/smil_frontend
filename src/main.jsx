import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { LoadingProvider } from '@/hooks/useLoading.jsx'
import '@styles/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import './i18n/index.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
        <LoadingProvider>
          <App />
        </LoadingProvider>
      <ToastContainer />
    </BrowserRouter>
  </StrictMode>,
)
