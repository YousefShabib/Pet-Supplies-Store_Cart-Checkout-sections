import { Box } from '@mui/material'
import { useEffect, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MiniCart } from './components/overlays/MiniCart'
import { RemoveDialog } from './components/overlays/RemoveDialog'
import { LeaveCheckoutDialog } from './components/overlays/LeaveCheckoutDialog'
import { ProcessingModal } from './components/overlays/ProcessingModal'
import { AppSnackbar } from './components/overlays/AppSnackbar'
import { on } from './contracts'
import { EmbeddedContext } from './embed'
import { isSeeding } from './mock/demoHarness'
import { CartPage } from './pages/CartPage'
import { CheckoutFailedPage } from './pages/CheckoutFailedPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { PaymentPage } from './pages/PaymentPage'
import { ShippingPage } from './pages/ShippingPage'
import { useCart } from './store/cartStore'
import { showSnackbar } from './store/uiStore'

function RequireCart({ children }: { children: ReactNode }) {
  const cart = useCart()
  if (cart.items.length === 0) return <Navigate to="/cart" replace />
  return children
}

function Overlays() {
  return (
    <>
      <MiniCart />
      <RemoveDialog />
      <LeaveCheckoutDialog />
      <ProcessingModal />
      <AppSnackbar />
    </>
  )
}

function BusToasts() {
  useEffect(() => {
    return on('cart:add', () => {
      if (!isSeeding) showSnackbar('Added to cart')
    })
  }, [])
  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function AppRoutes({ embedded = false }: { embedded?: boolean }) {
  return (
    <EmbeddedContext.Provider value={embedded}>
      <Box sx={{ minHeight: embedded ? 'auto' : '100vh', bgcolor: 'background.default' }}>
        <ScrollToTop />
        <BusToasts />
        <Routes>
          <Route path="/" element={<Navigate to="/cart" replace />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout/shipping"
            element={
              <RequireCart>
                <ShippingPage />
              </RequireCart>
            }
          />
          <Route
            path="/checkout/payment"
            element={
              <RequireCart>
                <PaymentPage />
              </RequireCart>
            }
          />
          <Route path="/checkout/success/:orderNumber" element={<ConfirmationPage />} />
          <Route path="/checkout/failed" element={<CheckoutFailedPage />} />
          <Route path="*" element={embedded ? null : <Navigate to="/cart" replace />} />
        </Routes>
        <Overlays />
      </Box>
    </EmbeddedContext.Provider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
