import { useSyncExternalStore } from 'react'
import type { CartItem } from '../contracts'

export interface SnackbarMessage {
  id: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

interface UiState {
  miniCartOpen: boolean
  snackbar: SnackbarMessage | null
  removeTarget: CartItem | null
  leaveCheckoutOpen: boolean
  pendingLeaveHref: string | null
}

const listeners = new Set<() => void>()

let state: UiState = {
  miniCartOpen: false,
  snackbar: null,
  removeTarget: null,
  leaveCheckoutOpen: false,
  pendingLeaveHref: null,
}

function notify() {
  listeners.forEach((listener) => listener())
}

function commit(partial: Partial<UiState>) {
  state = { ...state, ...partial }
  notify()
}

export function openMiniCart() {
  commit({ miniCartOpen: true })
}

export function closeMiniCart() {
  commit({ miniCartOpen: false })
}

export function showSnackbar(message: string, action?: { label: string; onAction: () => void }) {
  commit({
    snackbar: {
      id: `sb_${Date.now()}`,
      message,
      actionLabel: action?.label,
      onAction: action?.onAction,
    },
  })
}

export function clearSnackbar() {
  commit({ snackbar: null })
}

export function askRemoveItem(item: CartItem) {
  commit({ removeTarget: item })
}

export function clearRemoveTarget() {
  commit({ removeTarget: null })
}

export function askLeaveCheckout(href: string) {
  commit({ leaveCheckoutOpen: true, pendingLeaveHref: href })
}

export function clearLeaveCheckout() {
  commit({ leaveCheckoutOpen: false, pendingLeaveHref: null })
}

export function getUiState(): UiState {
  return state
}

export function subscribeUi(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useUi(): UiState {
  return useSyncExternalStore(subscribeUi, getUiState, getUiState)
}
