import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Container, Link, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddressForm } from '../components/checkout/AddressForm'
import { DeliveryMethodCards } from '../components/checkout/DeliveryMethodCards'
import { CheckoutFooter } from '../components/layout/CheckoutFooter'
import { CheckoutHeader } from '../components/layout/CheckoutHeader'
import { OrderSummary } from '../components/summary/OrderSummary'
import { formatMoney } from '../contracts'
import { useCart } from '../store/cartStore'
import { type ShippingErrors, validateShipping, useCheckout } from '../store/checkoutStore'
import { askLeaveCheckout } from '../store/uiStore'

export function ShippingPage() {
  const cart = useCart()
  const { shipping } = useCheckout()
  const navigate = useNavigate()
  const [errors, setErrors] = useState<ShippingErrors>({})

  const continuePayment = () => {
    const nextErrors = validateShipping(shipping)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    navigate('/checkout/payment')
  }

  return (
    <Box>
      <CheckoutHeader step={1} title="Shipping" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 340px' },
            gap: 4,
            alignItems: 'start',
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ mb: 3, display: { xs: 'none', md: 'block' } }}>
              Shipping Information
            </Typography>
            <AddressForm errors={errors} />
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Delivery method
              </Typography>
              <DeliveryMethodCards />
            </Box>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mt: 3, display: { md: 'none' } }}
              endIcon={<ArrowForwardIcon />}
              onClick={continuePayment}
              fullWidth
            >
              Continue to Payment
            </Button>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 96 }}>
            <Stack spacing={2}>
              {cart.items.slice(0, 3).map((item) => (
                <Stack key={`${item.productId}-${item.variantId}`} direction="row" spacing={1.5}>
                  <Box
                    component="img"
                    src={item.imageUrl}
                    alt={item.name}
                    sx={{ width: 56, height: 56, borderRadius: 1.5, objectFit: 'cover' }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={700}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.variantLabel}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700}>
                    {formatMoney(item.lineTotal, cart.currency)}
                  </Typography>
                </Stack>
              ))}
              <OrderSummary
                ctaLabel="Continue to Payment"
                onCta={continuePayment}
                footer={
                  <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Link
                      component="button"
                      underline="hover"
                      onClick={() => askLeaveCheckout('/cart')}
                    >
                      Back to Cart
                    </Link>
                  </Box>
                }
              />
            </Stack>
          </Box>
        </Box>
      </Container>
      <CheckoutFooter />
    </Box>
  )
}
