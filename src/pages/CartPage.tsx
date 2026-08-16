import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Container, Stack, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { CartItemCard } from '../components/cart/CartItemCard'
import { EmptyCart } from '../components/cart/EmptyCart'
import { PromoCode } from '../components/cart/PromoCode'
import { Recommendations } from '../components/cart/Recommendations'
import { StoreHeader } from '../components/layout/StoreHeader'
import { CheckoutFooter } from '../components/layout/CheckoutFooter'
import { OrderSummary } from '../components/summary/OrderSummary'
import { formatMoney } from '../contracts'
import { useEmbedded } from '../embed'
import { saveForLater, setQuantity, useCart } from '../store/cartStore'
import { askRemoveItem } from '../store/uiStore'

export function CartPage() {
  const cart = useCart()
  const embedded = useEmbedded()
  const navigate = useNavigate()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))
  const blocked = cart.items.some((item) => !item.available)

  const proceed = () => {
    if (cart.items.length === 0 || blocked) return
    navigate('/checkout/shipping')
  }

  return (
    <Box>
      {embedded ? null : mobile ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1.5,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Button href="/" sx={{ minWidth: 0, p: 0.5 }} color="inherit">
            <ArrowBackIcon />
          </Button>
          <Box>
            <Typography fontWeight={800}>Shopping Cart</Typography>
            {cart.items.length > 0 ? (
              <Typography variant="caption" color="text.secondary">
                {cart.itemCount} items
              </Typography>
            ) : null}
          </Box>
        </Box>
      ) : (
        <StoreHeader />
      )}

      <Container maxWidth="lg" sx={{ py: 4, pb: mobile && cart.items.length ? 12 : 4 }}>
        {cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {!mobile ? (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4">Shopping Cart</Typography>
                <Typography color="text.secondary">{cart.itemCount} items in your cart</Typography>
              </Box>
            ) : null}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 340px' },
                gap: 3,
                alignItems: 'start',
              }}
            >
              <Box>
                <Stack spacing={2}>
                  {cart.items.map((item) => (
                    <CartItemCard
                      key={`${item.productId}-${item.variantId}`}
                      item={item}
                      onQuantity={(quantity) => setQuantity(item.productId, item.variantId, quantity)}
                      onRemove={() => askRemoveItem(item)}
                      onSaveForLater={() => saveForLater(item.productId, item.variantId)}
                    />
                  ))}
                </Stack>
                <PromoCode />
                {!mobile ? <Recommendations /> : null}
              </Box>
              <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 88 }}>
                <OrderSummary
                  ctaLabel="Proceed to Checkout"
                  ctaDisabled={blocked}
                  onCta={proceed}
                  secondaryLabel="Continue Shopping"
                  onSecondary={() => {
                    window.location.assign('/')
                  }}
                />
              </Box>
            </Box>
            {mobile ? <Recommendations /> : null}
          </>
        )}
      </Container>

      {mobile && cart.items.length > 0 ? (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            zIndex: 20,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
            <Typography fontWeight={800}>{formatMoney(cart.totals.total, cart.currency)}</Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            disabled={blocked}
            onClick={proceed}
            endIcon={<ArrowForwardIcon />}
            sx={{ flex: 1.2 }}
          >
            Checkout
          </Button>
        </Box>
      ) : null}

      {!mobile ? <CheckoutFooter /> : null}
    </Box>
  )
}
