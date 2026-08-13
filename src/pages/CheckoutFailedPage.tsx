import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CheckoutFooter } from '../components/layout/CheckoutFooter'
import { CheckoutHeader } from '../components/layout/CheckoutHeader'

export function CheckoutFailedPage() {
  const navigate = useNavigate()

  return (
    <Box>
      <CheckoutHeader step={2} title="Payment" />
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: '#FDECEA',
            color: 'error.main',
            display: 'grid',
            placeItems: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          We could not complete your order.
        </Typography>
        <Box sx={{ bgcolor: '#F3F4F6', borderRadius: 2, p: 2.5, textAlign: 'left', mb: 3 }}>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            What you can do
          </Typography>
          <Typography component="ul" sx={{ m: 0, pl: 2.5 }} color="text.secondary">
            <li>Check your card details and try again.</li>
            <li>Switch to Cash on Delivery.</li>
            <li>Contact support if the problem continues.</li>
          </Typography>
        </Box>
        <Stack spacing={1.25}>
          <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/checkout/payment')}>
            Try Again
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate('/cart')}>
            Back to Cart
          </Button>
          <Button color="inherit" href="/support">
            Contact Support
          </Button>
        </Stack>
      </Container>
      <CheckoutFooter />
    </Box>
  )
}
