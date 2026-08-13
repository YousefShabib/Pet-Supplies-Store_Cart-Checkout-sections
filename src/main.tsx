import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import App from './App'
import './index.css'
import { initDemoHarness } from './mock/demoHarness'
import { initCartStore } from './store/cartStore'
import { initCheckoutStore } from './store/checkoutStore'
import { theme } from './theme'

initCartStore()
initCheckoutStore()
initDemoHarness()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
