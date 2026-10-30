import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { defineConfig } from 'vite'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
export default defineConfig({
  base: '/Belfive-Project/',
  // ...existing code...
});