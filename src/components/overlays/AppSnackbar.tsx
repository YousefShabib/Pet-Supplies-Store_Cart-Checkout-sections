import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Alert, Button, Snackbar } from '@mui/material'
import { clearSnackbar, useUi } from '../../store/uiStore'

export function AppSnackbar() {
  const { snackbar } = useUi()

  return (
    <Snackbar
      open={Boolean(snackbar)}
      autoHideDuration={4000}
      onClose={clearSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        icon={<CheckCircleIcon fontSize="inherit" />}
        severity="success"
        variant="filled"
        sx={{ bgcolor: '#2E2E2E', color: '#fff', alignItems: 'center' }}
        action={
          snackbar?.onAction ? (
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                snackbar.onAction?.()
                clearSnackbar()
              }}
            >
              {snackbar.actionLabel ?? 'Undo'}
            </Button>
          ) : undefined
        }
      >
        {snackbar?.message}
      </Alert>
    </Snackbar>
  )
}
