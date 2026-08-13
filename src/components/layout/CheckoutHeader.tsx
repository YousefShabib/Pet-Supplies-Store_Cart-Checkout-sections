import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import PetsIcon from '@mui/icons-material/Pets'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CheckoutStepper, type CheckoutStep } from './CheckoutStepper'
import { askLeaveCheckout } from '../../store/uiStore'

interface Props {
  step: CheckoutStep
  title?: string
}

export function CheckoutHeader({ step, title }: Props) {
  const navigate = useNavigate()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ maxWidth: 1280, mx: 'auto', width: '100%', gap: 2 }}>
        <IconButton
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{ display: { md: 'none' } }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box
          component="button"
          onClick={() => (step === 3 ? navigate('/cart') : askLeaveCheckout('/cart'))}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            color: 'primary.main',
            background: 'none',
            border: 0,
            cursor: 'pointer',
            p: 0,
            font: 'inherit',
          }}
        >
          <PetsIcon />
          <Typography variant="h6" fontWeight={800} sx={{ display: { xs: title ? 'none' : 'block', md: 'block' } }}>
            PawPantry
          </Typography>
        </Box>
        {title ? (
          <Typography variant="subtitle1" fontWeight={700} sx={{ display: { xs: 'block', md: 'none' } }}>
            {title}
          </Typography>
        ) : null}
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <CheckoutStepper step={step} />
        </Box>
        <IconButton aria-label="Help" sx={{ ml: 'auto' }}>
          <HelpOutlineIcon />
        </IconButton>
      </Toolbar>
      <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, pb: 1.5 }}>
        <CheckoutStepper step={step} compact />
      </Box>
    </AppBar>
  )
}
