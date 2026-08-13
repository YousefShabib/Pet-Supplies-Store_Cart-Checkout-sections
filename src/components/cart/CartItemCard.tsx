import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Box, Button, Card, CardContent, Stack, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { CartItem } from '../../contracts'
import { formatMoney, lineKey } from '../../contracts'
import { useCart } from '../../store/cartStore'
import { QuantityStepper } from './QuantityStepper'

interface Props {
  item: CartItem
  onQuantity: (quantity: number) => void
  onRemove: () => void
  onSaveForLater?: () => void
  compact?: boolean
}

export function CartItemCard({ item, onQuantity, onRemove, onSaveForLater, compact }: Props) {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))
  const { currency } = useCart()
  const isMobile = compact || mobile

  return (
    <Card key={lineKey(item)}>
      <CardContent sx={{ display: 'flex', gap: 2, position: 'relative' }}>
        {isMobile ? (
          <Button
            aria-label="Remove item"
            onClick={onRemove}
            sx={{ position: 'absolute', top: 8, right: 8, minWidth: 0, p: 0.5, color: 'text.secondary' }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </Button>
        ) : null}
        <Box
          component="img"
          src={item.imageUrl}
          alt={item.name}
          sx={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 2, bgcolor: '#F3F4F6', flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={1}>
            <Box>
              <Typography fontWeight={700}>{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.variantLabel}
              </Typography>
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.75 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: item.available ? 'success.main' : 'error.main',
                  }}
                />
                <Typography variant="caption" color={item.available ? 'success.main' : 'error.main'} fontWeight={600}>
                  {item.available ? 'In stock' : 'Unavailable'}
                </Typography>
              </Stack>
              {!isMobile ? (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button size="small" color="inherit" onClick={onRemove} sx={{ px: 0 }}>
                    Remove
                  </Button>
                  {onSaveForLater ? (
                    <Button size="small" color="inherit" onClick={onSaveForLater} sx={{ px: 0 }}>
                      Save for later
                    </Button>
                  ) : null}
                </Stack>
              ) : null}
            </Box>
            {!isMobile ? (
              <Stack alignItems="flex-end" spacing={1}>
                <QuantityStepper value={item.quantity} onChange={onQuantity} />
                <Typography fontWeight={800}>{formatMoney(item.lineTotal, currency)}</Typography>
              </Stack>
            ) : null}
          </Stack>
          {isMobile ? (
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
              <QuantityStepper value={item.quantity} onChange={onQuantity} />
              <Typography fontWeight={800}>{formatMoney(item.lineTotal, currency)}</Typography>
            </Stack>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  )
}
