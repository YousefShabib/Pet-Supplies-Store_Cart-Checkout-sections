import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { PaymentForm } from '../components/checkout/PaymentForm'
import { CheckoutFooter } from '../components/layout/CheckoutFooter'
import { CheckoutHeader } from '../components/layout/CheckoutHeader'
import { OrderSummary } from '../components/summary/OrderSummary'
import { formatMoney } from '../contracts'
import { useCart } from '../store/cartStore'
import { placeOrder, updatePayment, useCheckout } from '../store/checkoutStore'
import { askLeaveCheckout } from '../store/uiStore'

export function PaymentPage() {
  const cart = useCart()
  const { payment, processing } = useCheckout()
  const navigate = useNavigate()

  const onPlace = async () => {
    const { result, order } = await placeOrder()
    if (result === 'success' && order) {
      navigate(`/checkout/success/${order.orderNumber}`)
      return
    }
    if (result === 'failed') {
      navigate('/checkout/failed')
    }
  }

  return (
    <Box>
      <CheckoutHeader step={2} title="Payment" />
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
              Payment Details
            </Typography>
            <PaymentForm />
            <Accordion sx={{ mt: 3, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={700}>Review Your Order ({cart.itemCount} items)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1.5}>
                  {cart.items.map((item) => (
                    <Stack key={`${item.productId}-${item.variantId}`} direction="row" spacing={1.5}>
                      <Box
                        component="img"
                        src={item.imageUrl}
                        alt={item.name}
                        sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={700}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption">Qty {item.quantity}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={700}>
                        {formatMoney(item.lineTotal, cart.currency)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box sx={{ position: { md: 'sticky' }, top: 96 }}>
            <OrderSummary
              ctaLabel={`Place Order — ${formatMoney(cart.totals.total, cart.currency)}`}
              ctaDisabled={!payment.agreeTerms || cart.items.length === 0}
              ctaLoading={processing}
              onCta={onPlace}
              footer={
                <Box sx={{ mt: 1.5 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={payment.agreeTerms}
                        onChange={(event) => updatePayment({ agreeTerms: event.target.checked })}
                      />
                    }
                    label={
                      <Typography variant="caption">
                        I agree to the Terms of Service and Privacy Policy.
                      </Typography>
                    }
                  />
                  <Box sx={{ textAlign: 'center' }}>
                    <Link component="button" underline="hover" onClick={() => askLeaveCheckout('/checkout/shipping')}>
                      Back to Shipping
                    </Link>
                  </Box>
                </Box>
              }
            />
          </Box>
        </Box>
      </Container>
      <CheckoutFooter />
    </Box>
  )
}
