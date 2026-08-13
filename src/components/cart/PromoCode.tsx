import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import { Box, Button, InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import { applyPromo } from '../../store/cartStore'
import { showSnackbar } from '../../store/uiStore'

export function PromoCode() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const onApply = () => {
    const result = applyPromo(code)
    if (result === 'invalid') {
      setError('That promo code is not valid.')
      return
    }
    setError('')
    if (result === 'applied') {
      showSnackbar(`Promo code applied — ${code.trim().toUpperCase() === 'SAVE10' ? '10% off' : 'discount added'}`)
    }
    setCode('')
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
      <TextField
        fullWidth
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="Enter promo code"
        error={Boolean(error)}
        helperText={error || 'Try WELCOME, SAVE10, or FREESHIP'}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LocalOfferOutlinedIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
      />
      <Button variant="outlined" color="primary" onClick={onApply} sx={{ height: 56, px: 3, borderRadius: 2 }}>
        Apply
      </Button>
    </Box>
  )
}
