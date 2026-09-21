import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import LanguageProvider from './i18n/LanguageProvider.jsx'
import FeedbackProvider from './context/FeedbackProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <FeedbackProvider>
          <App />
        </FeedbackProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
)
