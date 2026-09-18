import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './example'
import './example.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
