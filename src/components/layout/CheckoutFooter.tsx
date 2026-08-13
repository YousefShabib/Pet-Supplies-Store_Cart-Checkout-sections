import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import PetsIcon from '@mui/icons-material/Pets'
import { Box, Link, Stack, Typography } from '@mui/material'

export function CheckoutFooter() {
  return (
    <Box component="footer" sx={{ mt: 6 }}>
      <Box sx={{ bgcolor: 'primary.main', color: '#fff', py: 2, textAlign: 'center' }}>
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          <FavoriteBorderIcon fontSize="small" />
          <Typography variant="body2" fontWeight={600}>
            Your pet is going to love this
          </Typography>
        </Stack>
      </Box>
      <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
          <PetsIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" color="primary" fontWeight={800}>
            PawPantry
          </Typography>
        </Stack>
        <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 1 }}>
          <Link href="/privacy" underline="hover" color="inherit" variant="body2">
            Privacy Policy
          </Link>
          <Link href="/terms" underline="hover" color="inherit" variant="body2">
            Terms of Service
          </Link>
          <Link href="/support" underline="hover" color="inherit" variant="body2">
            Contact Support
          </Link>
        </Stack>
        <Typography variant="caption">© 2026 PawPantry. All rights reserved.</Typography>
      </Box>
    </Box>
  )
}
