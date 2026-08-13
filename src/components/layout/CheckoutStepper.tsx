import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material'

export type CheckoutStep = 1 | 2 | 3

const STEPS = ['Shipping', 'Payment', 'Confirmation']

interface Props {
  step: CheckoutStep
  compact?: boolean
}

export function CheckoutStepper({ step, compact }: Props) {
  return (
    <Box sx={{ width: compact ? '100%' : 420 }}>
      <Stepper activeStep={step - 1} alternativeLabel={!compact}>
        {STEPS.map((label, index) => {
          const completed = index < step - 1
          const current = index === step - 1
          return (
            <Step key={label} completed={completed}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: compact ? 22 : 28,
                      height: compact ? 22 : 28,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: completed || current ? 'primary.main' : '#E5E7EB',
                      color: completed || current ? '#fff' : 'text.secondary',
                      fontSize: compact ? 12 : 14,
                      fontWeight: 700,
                    }}
                  >
                    {completed ? <CheckCircleIcon sx={{ fontSize: compact ? 16 : 20 }} /> : index + 1}
                  </Box>
                )}
              >
                <Typography variant={compact ? 'caption' : 'body2'} fontWeight={current ? 700 : 500}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          )
        })}
      </Stepper>
    </Box>
  )
}
