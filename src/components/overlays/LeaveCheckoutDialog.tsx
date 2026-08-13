import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { clearLeaveCheckout, useUi } from '../../store/uiStore'

export function LeaveCheckoutDialog() {
  const { leaveCheckoutOpen, pendingLeaveHref } = useUi()
  const navigate = useNavigate()

  const stay = () => clearLeaveCheckout()

  const leave = () => {
    const href = pendingLeaveHref
    clearLeaveCheckout()
    if (href) navigate(href)
  }

  return (
    <Dialog open={leaveCheckoutOpen} onClose={stay}>
      <DialogTitle>Leave checkout?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your shipping and payment details are saved on this device, but you will leave the checkout flow.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={leave} color="inherit">
          Leave
        </Button>
        <Button onClick={stay} variant="contained" color="primary">
          Stay
        </Button>
      </DialogActions>
    </Dialog>
  )
}
