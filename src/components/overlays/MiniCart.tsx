import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined'
import { Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { formatMoney } from '../../contracts'
import { setQuantity, useCart } from '../../store/cartStore'
import { closeMiniCart, useUi } from '../../store/uiStore'
import { QuantityStepper } from '../cart/QuantityStepper'

export function MiniCart() {
  const { miniCartOpen } = useUi()
  const cart = useCart()
  const navigate = useNavigate()

  const go = (path: string) => {
    closeMiniCart()
    navigate(path)
  }

  return (
    <Drawer anchor="right" open={miniCartOpen} onClose={closeMiniCart}>
      <Box sx={{ width: { xs: 320, sm: 380 }, p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Your Cart ({cart.itemCount})</Typography>
          <IconButton aria-label="Close cart" onClick={closeMiniCart}>
            <CloseIcon />
          </IconButton>
        </Stack>

        {cart.items.length === 0 ? (
          <Box sx={{ textAlign: 'center', my: 'auto' }}>
            <ShoppingBasketOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography fontWeight={700}>Nothing here yet</Typography>
            <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => go('/')}>
              Start Shopping
            </Button>
          </Box>
        ) : (
          <>
            <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
              {cart.items.map((item) => (
                <Stack key={`${item.productId}-${item.variantId}`} direction="row" spacing={1.5}>
                  <Box
                    component="img"
                    src={item.imageUrl}
                    alt={item.name}
                    sx={{ width: 64, height: 64, borderRadius: 1.5, objectFit: 'cover' }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} noWrap>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.variantLabel}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.75 }}>
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(quantity) => setQuantity(item.productId, item.variantId, quantity)}
                      />
                      <Typography variant="body2" fontWeight={700}>
                        {formatMoney(item.lineTotal, cart.currency)}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Stack>
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, mt: 2 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography fontWeight={700}>Subtotal</Typography>
                <Typography fontWeight={800}>{formatMoney(cart.totals.subtotal, cart.currency)}</Typography>
              </Stack>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                onClick={() => go('/checkout/shipping')}
              >
                Checkout
              </Button>
              <Button fullWidth variant="outlined" color="primary" sx={{ mt: 1 }} onClick={() => go('/cart')}>
                View Full Cart
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  )
}
