import AddIcon from '@mui/icons-material/Add'
import { Box, Card, CardContent, IconButton, Stack, Typography } from '@mui/material'
import { formatMoney } from '../../contracts'
import { RECOMMENDED_PRODUCTS, simulateCatalogAdd } from '../../mock/demoHarness'

export function Recommendations() {
  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Your pet may also like
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{ overflowX: 'auto', pb: 1, mx: { xs: -2, md: 0 }, px: { xs: 2, md: 0 } }}
      >
        {RECOMMENDED_PRODUCTS.map((product) => (
          <Card key={product.variantId} sx={{ minWidth: 180, width: 180, flexShrink: 0, position: 'relative' }}>
            <Box
              component="img"
              src={product.imageUrl}
              alt={product.name}
              sx={{ height: 140, width: '100%', objectFit: 'cover' }}
            />
            {product.compareAtPrice ? (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  bgcolor: 'secondary.main',
                  color: '#fff',
                  px: 1,
                  py: 0.25,
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                Sale
              </Box>
            ) : (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  bgcolor: 'primary.main',
                  color: '#fff',
                  px: 1,
                  py: 0.25,
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                New
              </Box>
            )}
            <CardContent sx={{ pb: '16px !important' }}>
              <Typography variant="body2" fontWeight={700} noWrap>
                {product.name}
              </Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                <Typography fontWeight={800}>{formatMoney(product.unitPrice, product.currency)}</Typography>
                <IconButton
                  size="small"
                  color="primary"
                  aria-label={`Add ${product.name}`}
                  onClick={() => simulateCatalogAdd(product)}
                  sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
