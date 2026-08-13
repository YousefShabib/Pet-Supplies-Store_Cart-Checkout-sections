import { CssBaseline, ThemeProvider } from '@mui/material'
import r2wc from '@r2wc/react-to-web-component'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { initDemoHarness } from './mock/demoHarness'
import { initCartStore } from './store/cartStore'
import { initCheckoutStore } from './store/checkoutStore'
import { theme } from './theme'
import './index.css'

initCartStore()
initCheckoutStore()
initDemoHarness()

function PawPantryCartElement() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}

const PawPantryCart = r2wc(PawPantryCartElement, {
  props: {},
})

if (!customElements.get('pawpantry-cart')) {
  customElements.define('pawpantry-cart', PawPantryCart)
}

export default PawPantryCart
