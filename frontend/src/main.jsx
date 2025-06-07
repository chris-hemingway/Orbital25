import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import RootApp from './App.jsx'
import 'antd/dist/reset.css'
import Search from './pages/Search.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)
