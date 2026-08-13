import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { Box, IconButton, Typography } from '@mui/material'
import { DEFAULT_MAX_PER_ORDER } from '../../store/cartStore'

interface Props {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantityStepper({ value, onChange, min = 1, max = DEFAULT_MAX_PER_ORDER }: Props) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 999,
        overflow: 'hidden',
      }}
    >
      <IconButton
        size="small"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>
      <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{value}</Typography>
      <IconButton
        size="small"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}
