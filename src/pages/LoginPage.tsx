import PetsIcon from '@mui/icons-material/Pets'
import { Box, Button, Container, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { simulateSignedIn } from '../mock/demoHarness'

export function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/checkout/shipping'

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <PetsIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="h4">Sign in to continue</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Account is owned by another microfrontend. This standalone screen mocks a successful login and returns you to
        checkout.
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        onClick={() => {
          simulateSignedIn('sign_in')
          navigate(redirect)
        }}
      >
        Continue as Jane Doe
      </Button>
      <Box sx={{ mt: 2 }}>
        <Button color="inherit" onClick={() => navigate('/cart')}>
          Back to cart
        </Button>
      </Box>
    </Container>
  )
}
