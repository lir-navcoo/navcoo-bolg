import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from './components/ui/sonner.tsx'
import { ThemeProvider } from './components/ThemeProvider'
import { I18nProvider } from './i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
        <Toaster position="top-right" richColors closeButton />
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
