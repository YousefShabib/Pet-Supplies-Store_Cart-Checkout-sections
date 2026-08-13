import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckoutFooter } from '../components/layout/CheckoutFooter'
import { CheckoutHeader } from '../components/layout/CheckoutHeader'
import { formatMoney } from '../contracts'
import { formatAddressLine, useCheckout } from '../store/checkoutStore'
import { showSnackbar } from '../store/uiStore'

const TRACK = ['Order Placed', 'Processing', 'On the Way', 'Delivered']

export function ConfirmationPage() {
  const { orderNumber } = useParams()
  const { lastOrder } = useCheckout()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const order = lastOrder && lastOrder.orderNumber === orderNumber ? lastOrder : lastOrder

  if (!order) {
    return (
      <Box>
        <CheckoutHeader step={3} title="Confirmation" />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5">No order to show</Typography>
          <Button sx={{ mt: 2 }} variant="contained" color="secondary" onClick={() => navigate('/cart')}>
            Back to Cart
          </Button>
        </Container>
      </Box>
    )
  }

  const copy = async () => {
    await navigator.clipboard.writeText(order.orderNumber)
    setCopied(true)
    showSnackbar('Order number copied')
  }

  const paymentLabel =
    order.payment.kind === 'cash_on_delivery'
      ? 'Cash on Delivery'
      : order.payment.kind === 'wallet'
        ? 'Digital Wallet'
        : `${order.payment.brand === 'mastercard' ? 'Mastercard' : 'Visa'} •••• ${order.payment.last4 ?? ''}`

  return (
    <Box>
      <CheckoutHeader step={3} title="Confirmation" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <CheckIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h4">Thank you! Your order is confirmed.</Typography>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
            <Typography color="text.secondary">Order Number</Typography>
            <Typography fontWeight={800}>#{order.orderNumber}</Typography>
            <Button size="small" onClick={copy} startIcon={<ContentCopyIcon />} color="inherit">
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Estimated arrival
                </Typography>
                <LinearProgress variant="determinate" value={25} sx={{ height: 8, borderRadius: 999, mb: 2 }} />
                <Stack direction="row" justifyContent="space-between">
                  {TRACK.map((label, index) => (
                    <Typography
                      key={label}
                      variant="caption"
                      fontWeight={index === 0 ? 800 : 500}
                      color={index === 0 ? 'primary' : 'text.secondary'}
                    >
                      {label}
                    </Typography>
                  ))}
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Order summary
                </Typography>
                <Stack spacing={1.5}>
                  {order.items.map((item) => (
                    <Stack key={`${item.productId}-${item.variantId}`} direction="row" spacing={1.5}>
                      <Box
                        component="img"
                        src={item.imageUrl}
                        alt={item.name}
                        sx={{ width: 56, height: 56, borderRadius: 1.5, objectFit: 'cover' }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={700}>{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.variantLabel} · Qty {item.quantity}
                        </Typography>
                      </Box>
                      <Typography fontWeight={700}>{formatMoney(item.lineTotal, order.totals.currency)}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 2, pt: 2 }}>
                  <Row label="Subtotal" value={formatMoney(order.totals.subtotal, order.totals.currency)} />
                  <Row
                    label="Delivery"
                    value={order.totals.delivery === 0 ? 'Free' : formatMoney(order.totals.delivery, order.totals.currency)}
                  />
                  {order.totals.discount > 0 ? (
                    <Row
                      label="Discount"
                      value={`-${formatMoney(order.totals.discount, order.totals.currency)}`}
                    />
                  ) : null}
                  <Row label="Total" value={formatMoney(order.totals.total, order.totals.currency)} bold />
                </Box>
              </CardContent>
            </Card>
          </Stack>

          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6">Delivery address</Typography>
                <Typography fontWeight={700} sx={{ mt: 1 }}>
                  {order.shippingAddress.recipientName}
                </Typography>
                <Typography color="text.secondary">{formatAddressLine(order.shippingAddress)}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6">Payment method</Typography>
                <Typography sx={{ mt: 1 }}>{paymentLabel}</Typography>
              </CardContent>
            </Card>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              href={`/account/orders/${order.orderNumber}`}
            >
              Track Your Order
            </Button>
            <Button variant="text" color="primary" href="/">
              Continue Shopping
            </Button>
            <Link href="#" underline="hover" textAlign="center">
              Download Invoice
            </Link>
          </Stack>
        </Box>
      </Container>
      <CheckoutFooter />
    </Box>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
      <Typography fontWeight={bold ? 800 : 500}>{label}</Typography>
      <Typography fontWeight={bold ? 800 : 600}>{value}</Typography>
    </Stack>
  )
}
