import PetsIcon from '@mui/icons-material/Pets'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { AppBar, Badge, Box, IconButton, InputBase, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useCart } from '../../store/cartStore'
import { openMiniCart } from '../../store/uiStore'

export function StoreHeader() {
  const { itemCount } = useCart()

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
      <Toolbar sx={{ gap: 2, py: 1, maxWidth: 1280, mx: 'auto', width: '100%' }}>
        <Box
          component={RouterLink}
          to="/cart"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'primary.main' }}
        >
          <PetsIcon />
          <Typography variant="h6" fontWeight={800} letterSpacing={-0.4}>
            PawPantry
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            bgcolor: '#F3F4F6',
            borderRadius: 999,
            px: 2,
            py: 0.75,
            maxWidth: 560,
            mx: 'auto',
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            fullWidth
            placeholder="Search for food, toys, and more..."
            inputProps={{ 'aria-label': 'Search catalog' }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <IconButton aria-label="Open cart" onClick={openMiniCart} color="inherit">
            <Badge badgeContent={itemCount} color="secondary" max={99}>
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
          <IconButton aria-label="Account" href="/account" color="inherit">
            <PersonOutlineIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
