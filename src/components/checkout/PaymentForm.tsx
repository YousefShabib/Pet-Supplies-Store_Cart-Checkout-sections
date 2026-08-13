import type { ReactNode } from 'react'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { formatMoney } from '../../contracts'
import { CASH_FEE, setPaymentKind, useCart } from '../../store/cartStore'
import { setCardError, updatePayment, useCheckout } from '../../store/checkoutStore'
import { formatAddressLine, shippingToAddress } from '../../store/checkoutStore'

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function PaymentForm() {
  const cart = useCart()
  const { payment, cardError, shipping } = useCheckout()
  const address = shippingToAddress(shipping)

  return (
    <Stack spacing={3}>
      {cardError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => setCardError(null)}>
              Try Again
            </Button>
          }
        >
          Payment could not be completed. Please check your card details and try again, or choose Cash on Delivery.
        </Alert>
      ) : (
        <Alert severity="warning">
          Demo mode — use card <strong>4242 4242 4242 4242</strong> to succeed. Cards ending in 0000 simulate a failed
          order. Any other card is declined.
        </Alert>
      )}

      <Box>
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          Payment method
        </Typography>
        <Stack spacing={1.25}>
          <MethodCard
            selected={cart.paymentKind === 'card'}
            title="Credit or Debit Card"
            onClick={() => setPaymentKind('card')}
          />
          <MethodCard
            selected={cart.paymentKind === 'cash_on_delivery'}
            title="Cash on Delivery"
            extra={<Chip size="small" label={`+${formatMoney(CASH_FEE, cart.currency)} fee`} color="warning" />}
            onClick={() => setPaymentKind('cash_on_delivery')}
          />
          <MethodCard
            selected={cart.paymentKind === 'wallet'}
            title="Digital Wallet"
            onClick={() => setPaymentKind('wallet')}
          />
        </Stack>
      </Box>

      {cart.paymentKind === 'card' ? (
        <Card>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <CreditCardIcon color="primary" />
              <Typography fontWeight={700}>Credit Card</Typography>
            </Stack>
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                borderRadius: 3,
                p: 2.5,
                mb: 2.5,
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="overline">PawPantry</Typography>
              <Typography letterSpacing={2} fontWeight={700}>
                {payment.cardNumber || '•••• •••• •••• ••••'}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">{payment.nameOnCard || 'Name on card'}</Typography>
                <Typography variant="body2">{payment.expiry || 'MM/YY'}</Typography>
              </Stack>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Name on card"
                  fullWidth
                  value={payment.nameOnCard}
                  onChange={(event) => updatePayment({ nameOnCard: event.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Card number"
                  fullWidth
                  value={payment.cardNumber}
                  error={Boolean(cardError)}
                  helperText={cardError ?? 'Never stored in events — last 4 only after placing the order.'}
                  onChange={(event) => updatePayment({ cardNumber: formatCardNumber(event.target.value) })}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Expiry (MM/YY)"
                  fullWidth
                  value={payment.expiry}
                  onChange={(event) => updatePayment({ expiry: event.target.value.slice(0, 5) })}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="CVV"
                  fullWidth
                  type="password"
                  value={payment.cvv}
                  onChange={(event) => updatePayment({ cvv: event.target.value.replace(/\D/g, '').slice(0, 4) })}
                />
              </Grid>
            </Grid>
            <FormControlLabel
              sx={{ mt: 1 }}
              control={
                <Checkbox
                  checked={payment.saveCard}
                  onChange={(event) => updatePayment({ saveCard: event.target.checked })}
                />
              }
              label="Save this card for future purchases"
            />
            <Button color="primary" sx={{ mt: 1 }} onClick={() => setPaymentKind('cash_on_delivery')}>
              Use another method
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Billing address
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={payment.sameAsDelivery}
              onChange={(event) => updatePayment({ sameAsDelivery: event.target.checked })}
            />
          }
          label="Same as delivery address"
        />
        {payment.sameAsDelivery ? (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            {formatAddressLine(address)}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            Guest billing uses the delivery address in this demo.
          </Typography>
        )}
      </Box>
    </Stack>
  )
}

function MethodCard({
  selected,
  title,
  extra,
  onClick,
}: {
  selected: boolean
  title: string
  extra?: ReactNode
  onClick: () => void
}) {
  return (
    <Card sx={{ borderColor: selected ? 'primary.main' : 'divider', borderWidth: selected ? 2 : 1 }}>
      <CardActionArea onClick={onClick}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: selected ? 'primary.main' : 'divider',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {selected ? <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} /> : null}
          </Box>
          <Typography fontWeight={700} sx={{ flex: 1 }}>
            {title}
          </Typography>
          {extra}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
