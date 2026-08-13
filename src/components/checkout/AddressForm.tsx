import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { GOVERNORATE_NAMES, GOVERNORATES } from '../../data/locations'
import {
  type PreferredTime,
  type ShippingErrors,
  updateShipping,
  useCheckout,
} from '../../store/checkoutStore'

interface Props {
  errors: ShippingErrors
}

export function AddressForm({ errors }: Props) {
  const { shipping } = useCheckout()
  const cities = shipping.governorate ? GOVERNORATES[shipping.governorate] ?? [] : []

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Contact information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Full name"
              fullWidth
              value={shipping.fullName}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName}
              onChange={(event) => updateShipping({ fullName: event.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Phone number"
              fullWidth
              value={shipping.phone}
              error={Boolean(errors.phone)}
              helperText={errors.phone || 'E.164, e.g. +970591234567'}
              onChange={(event) => updateShipping({ phone: event.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Email (optional)"
              fullWidth
              value={shipping.email}
              error={Boolean(errors.email)}
              helperText={errors.email}
              onChange={(event) => updateShipping({ email: event.target.value })}
            />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Delivery area
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth error={Boolean(errors.governorate)}>
              <InputLabel>Governorate</InputLabel>
              <Select
                label="Governorate"
                value={shipping.governorate}
                onChange={(event) => updateShipping({ governorate: event.target.value, city: '' })}
              >
                {GOVERNORATE_NAMES.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {errors.governorate ? <FormHelperText>{errors.governorate}</FormHelperText> : null}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth error={Boolean(errors.city)}>
              <InputLabel>City</InputLabel>
              <Select
                label="City"
                value={shipping.city}
                onChange={(event) => updateShipping({ city: event.target.value })}
              >
                {cities.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {errors.city ? <FormHelperText>{errors.city}</FormHelperText> : null}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ bgcolor: '#E8F5E9', color: 'primary.dark', p: 1.5, borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                Delivery: $5.00 — arrives in 2 to 3 business days. Express is $9.00.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Street address"
              fullWidth
              value={shipping.street}
              error={Boolean(errors.street)}
              helperText={errors.street}
              onChange={(event) => updateShipping({ street: event.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Building / apartment"
              fullWidth
              value={shipping.building}
              onChange={(event) => updateShipping({ building: event.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Floor"
              fullWidth
              value={shipping.floor}
              onChange={(event) => updateShipping({ floor: event.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Nearby landmark (optional)"
              fullWidth
              value={shipping.landmark}
              onChange={(event) => updateShipping({ landmark: event.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={shipping.saveAddress}
                  onChange={(event) => updateShipping({ saveAddress: event.target.checked })}
                />
              }
              label="Save this address for next time"
            />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          Preferred time
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={shipping.preferredTime}
          onChange={(_, value: PreferredTime | null) => {
            if (value) updateShipping({ preferredTime: value })
          }}
        >
          <ToggleButton value="morning">Morning</ToggleButton>
          <ToggleButton value="afternoon">Afternoon</ToggleButton>
          <ToggleButton value="evening">Evening</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <TextField
        label="Additional instructions"
        fullWidth
        multiline
        minRows={3}
        value={shipping.notes}
        onChange={(event) => updateShipping({ notes: event.target.value })}
      />
    </Stack>
  )
}
