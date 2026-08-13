import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { lineKey } from '../../contracts'
import { removeItem } from '../../store/cartStore'
import { restoreRemovedItem } from '../../store/cartStore'
import { clearRemoveTarget, showSnackbar, useUi } from '../../store/uiStore'

export function RemoveDialog() {
  const { removeTarget } = useUi()

  const close = () => clearRemoveTarget()

  const confirm = () => {
    if (!removeTarget) return
    const item = removeTarget
    removeItem(item.productId, item.variantId)
    close()
    showSnackbar('Item removed', {
      label: 'Undo',
      onAction: () => restoreRemovedItem(item),
    })
  }

  return (
    <Dialog open={Boolean(removeTarget)} onClose={close}>
      <DialogTitle>Remove this item?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {removeTarget
            ? `${removeTarget.name} (${removeTarget.variantLabel}) will be taken out of your cart.`
            : ''}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={close} color="inherit">
          Keep it
        </Button>
        <Button onClick={confirm} color="error" variant="contained" id={removeTarget ? lineKey(removeTarget) : undefined}>
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  )
}
