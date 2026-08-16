import { CssBaseline, ThemeProvider } from '@mui/material'
import r2wc from '@r2wc/react-to-web-component'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { isEmbeddedProp } from './embed'
import { initCartStore } from './store/cartStore'
import { initCheckoutStore } from './store/checkoutStore'
import { theme } from './theme'
import indexCss from './index.css?url'
import './index.css'

function injectCss(href: string) {
  const abs = new URL(href, import.meta.url).href
  if (document.querySelector(`link[data-pp-href="${abs}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = abs
  link.setAttribute('data-pp-href', abs)
  document.head.appendChild(link)
}

injectCss(indexCss)

initCartStore()
initCheckoutStore()

function PawPantryCartElement({ embedded }: { embedded?: boolean | string }) {
  const isEmbedded = isEmbeddedProp(embedded)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes embedded={isEmbedded} />
      </BrowserRouter>
    </ThemeProvider>
  )
}

const PawPantryCart = r2wc(PawPantryCartElement, {
  props: {
    embedded: 'boolean',
  },
})

if (!customElements.get('pawpantry-cart')) {
  customElements.define('pawpantry-cart', PawPantryCart)
}

export default PawPantryCart
