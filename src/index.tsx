import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './pages/App'
import './tags.css'
import reportWebVitals from './reportWebVitals'
import { animateEls } from './scroller/scroller'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement) 

root.render(
  <App />
)