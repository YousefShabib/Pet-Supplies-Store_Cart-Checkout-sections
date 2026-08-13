import { Box, CircularProgress, Dialog, DialogContent, Typography } from '@mui/material'
import { useCheckout } from '../../store/checkoutStore'

export function ProcessingModal() {
  const { processing } = useCheckout()

  return (
    <Dialog open={processing} disableEscapeKeyDown>
      <DialogContent sx={{ textAlign: 'center', py: 5, px: 4, minWidth: 300 }}>
        <CircularProgress color="primary" sx={{ mb: 2 }} />
        <Typography variant="h6">Placing your order...</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we securely process your payment. Do not refresh this page.
        </Typography>
        <Box aria-hidden />
      </DialogContent>
    </Dialog>
  )
}
