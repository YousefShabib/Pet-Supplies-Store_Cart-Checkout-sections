import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Box, Button, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { formatMoney } from '../../contracts'
import { amountToFreeDelivery, FREE_DELIVERY_THRESHOLD, useCart } from '../../store/cartStore'

interface Props {
  ctaLabel: string
  ctaDisabled?: boolean
  ctaLoading?: boolean
  onCta: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  footer?: ReactNode
}

export function OrderSummary({
  ctaLabel,
  ctaDisabled,
  ctaLoading,
  onCta,
  secondaryLabel,
  onSecondary,
  footer,
}: Props) {
  const cart = useCart()
  const remaining = amountToFreeDelivery()
  const progress =
    remaining <= 0 ? 100 : Math.min(100, ((FREE_DELIVERY_THRESHOLD - remaining) / FREE_DELIVERY_THRESHOLD) * 100)

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Order Summary
        </Typography>
        <Stack spacing={1.25}>
          <Row label="Subtotal" value={formatMoney(cart.totals.subtotal, cart.currency)} />
          {cart.totals.discount > 0 ? (
            <Row
              label={`Discount${cart.promoCode ? ` (${cart.promoCode})` : ''}`}
              value={`-${formatMoney(cart.totals.discount, cart.currency)}`}
              color="success.main"
            />
          ) : null}
          <Row
            label={cart.deliveryMethod === 'express' ? 'Express delivery' : 'Estimated delivery'}
            value={cart.totals.delivery === 0 ? 'Free' : formatMoney(cart.totals.delivery, cart.currency)}
          />
          {cart.totals.cashFee > 0 ? (
            <Row label="Cash on delivery fee" value={formatMoney(cart.totals.cashFee, cart.currency)} />
          ) : null}
        </Stack>
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 2, pt: 2, mb: 2 }}>
          <Row label="Total" value={formatMoney(cart.totals.total, cart.currency)} bold />
        </Box>
        {cart.deliveryMethod === 'standard' ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {remaining > 0
                ? `Add ${formatMoney(remaining, cart.currency)} more for free delivery.`
                : 'You unlocked free delivery.'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mt: 1, height: 8, borderRadius: 999, bgcolor: '#E8F5E9' }}
            />
          </Box>
        ) : null}
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          size="large"
          disabled={ctaDisabled}
          onClick={onCta}
          endIcon={ctaLoading ? undefined : <ArrowForwardIcon />}
        >
          {ctaLoading ? 'Processing...' : ctaLabel}
        </Button>
        {secondaryLabel && onSecondary ? (
          <Button fullWidth variant="outlined" color="primary" sx={{ mt: 1.25 }} onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        ) : null}
        <Stack direction="row" spacing={0.75} justifyContent="center" alignItems="center" sx={{ mt: 1.5 }}>
          <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Secure checkout
          </Typography>
        </Stack>
        {footer}
      </CardContent>
    </Card>
  )
}

function Row({
  label,
  value,
  color,
  bold,
}: {
  label: string
  value: string
  color?: string
  bold?: boolean
}) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography fontWeight={bold ? 800 : 500}>{label}</Typography>
      <Typography fontWeight={bold ? 800 : 600} color={color}>
        {value}
      </Typography>
    </Stack>
  )
}
