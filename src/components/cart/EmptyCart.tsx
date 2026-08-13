import PetsIcon from '@mui/icons-material/Pets'
import { Box, Button, Link, Stack, Typography } from '@mui/material'

export function EmptyCart() {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 8, md: 12 }, px: 2 }}>
      <Box
        sx={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          bgcolor: '#ECEFF1',
          display: 'grid',
          placeItems: 'center',
          mx: 'auto',
          mb: 3,
        }}
      >
        <PetsIcon sx={{ fontSize: 44, color: 'text.secondary' }} />
      </Box>
      <Typography variant="h5" gutterBottom>
        Your cart is empty
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: 3 }}>
        Looks like you have not added anything yet. Let us find something your pet will love.
      </Typography>
      <Stack spacing={1.5} alignItems="center">
        <Button href="/" variant="contained" color="secondary" size="large" sx={{ minWidth: 220 }}>
          Browse Products
        </Button>
        <Link href="/account/wishlist" underline="hover" color="primary" fontWeight={600}>
          View wishlist
        </Link>
      </Stack>
    </Box>
  )
}
