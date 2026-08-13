import PetsIcon from '@mui/icons-material/Pets'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { DEMO_CART_ITEMS, simulateCatalogAdd, simulateSignedIn, simulateSignedOut } from '../mock/demoHarness'
import { StoreHeader } from '../components/layout/StoreHeader'
import { CheckoutFooter } from '../components/layout/CheckoutFooter'

export function DemoHomePage() {
  const navigate = useNavigate()

  return (
    <Box>
      <StoreHeader />
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <PetsIcon color="primary" sx={{ fontSize: 56, mb: 1 }} />
        <Typography variant="h4">PawPantry Cart & Checkout</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          This microfrontend owns cart, shipping, payment, and confirmation. Catalog and account live in the other
          group repos. Use the demo actions below while developing standalone.
        </Typography>
        <Stack spacing={1.25}>
          <Button variant="contained" color="secondary" onClick={() => navigate('/cart')}>
            Open Shopping Cart
          </Button>
          <Button variant="outlined" color="primary" onClick={() => simulateCatalogAdd(DEMO_CART_ITEMS[0])}>
            Simulate catalog: add item
          </Button>
          <Button variant="outlined" onClick={() => simulateSignedIn('sign_in')}>
            Simulate signed in
          </Button>
          <Button variant="outlined" color="inherit" onClick={() => simulateSignedOut()}>
            Simulate sign out
          </Button>
        </Stack>
      </Container>
      <CheckoutFooter />
    </Box>
  )
}
