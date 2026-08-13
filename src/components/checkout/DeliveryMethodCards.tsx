import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import { formatMoney } from '../../contracts'
import { EXPRESS_DELIVERY, STANDARD_DELIVERY, setDeliveryMethod, useCart } from '../../store/cartStore'

export function DeliveryMethodCards() {
  const { deliveryMethod, currency } = useCart()

  return (
    <Stack spacing={1.5}>
      <Option
        selected={deliveryMethod === 'standard'}
        title="Standard Delivery"
        subtitle="2–3 business days"
        price={formatMoney(STANDARD_DELIVERY, currency)}
        onClick={() => setDeliveryMethod('standard')}
      />
      <Option
        selected={deliveryMethod === 'express'}
        title="Express Delivery"
        subtitle="Same day / next day"
        price={formatMoney(EXPRESS_DELIVERY, currency)}
        onClick={() => setDeliveryMethod('express')}
      />
    </Stack>
  )
}

function Option({
  selected,
  title,
  subtitle,
  price,
  onClick,
}: {
  selected: boolean
  title: string
  subtitle: string
  price: string
  onClick: () => void
}) {
  return (
    <Card
      sx={{
        borderColor: selected ? 'primary.main' : 'divider',
        borderWidth: selected ? 2 : 1,
        bgcolor: selected ? '#F1F8F4' : 'background.paper',
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: selected ? 'primary.main' : 'divider',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {selected ? <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} /> : null}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} alignItems="center">
            {selected ? <CheckCircleIcon color="primary" fontSize="small" /> : null}
            <Typography fontWeight={800}>{price}</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
