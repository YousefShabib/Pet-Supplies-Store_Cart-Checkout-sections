import { useSyncExternalStore } from 'react'
import {
  CART_STORAGE_KEY,
  type CartAddPayload,
  type CartItem,
  type CartSnapshot,
  type CartTotals,
  type CurrencyCode,
  type Minor,
  computeTotals,
  emit,
  lineKey,
  on,
} from '../contracts'

export const DEFAULT_MAX_PER_ORDER = 10
export const FREE_DELIVERY_THRESHOLD: Minor = 5000
export const STANDARD_DELIVERY: Minor = 500
export const EXPRESS_DELIVERY: Minor = 900
export const CASH_FEE: Minor = 150

export type DeliveryMethod = 'standard' | 'express'
export type PaymentKind = 'card' | 'cash_on_delivery' | 'wallet'

interface PersistedCart {
  items: CartItem[]
  promoCode?: string
  savedForLater: CartItem[]
  currency: CurrencyCode
}

export interface CartState {
  items: CartItem[]
  savedForLater: CartItem[]
  promoCode?: string
  currency: CurrencyCode
  totals: CartTotals
  itemCount: number
  deliveryMethod: DeliveryMethod
  paymentKind: PaymentKind
}

const listeners = new Set<() => void>()

let deliveryMethod: DeliveryMethod = 'standard'
let paymentKind: PaymentKind = 'card'

let state: CartState = {
  items: [],
  savedForLater: [],
  currency: 'USD',
  totals: emptyTotals('USD'),
  itemCount: 0,
  deliveryMethod,
  paymentKind,
}

function emptyTotals(currency: CurrencyCode): CartTotals {
  return computeTotals([], { currency })
}

function notify() {
  listeners.forEach((listener) => listener())
}

function persist() {
  const payload: PersistedCart = {
    items: state.items,
    promoCode: state.promoCode,
    savedForLater: state.savedForLater,
    currency: state.currency,
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload))
}

function discountFor(items: CartItem[], promoCode: string | undefined): Minor {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const code = promoCode?.trim().toUpperCase()
  if (!code) return 0
  if (code === 'WELCOME') return Math.min(500, subtotal)
  if (code === 'SAVE10') return Math.floor(subtotal * 0.1)
  if (code === 'FREESHIP') return 0
  return 0
}

function deliveryFor(
  items: CartItem[],
  promoCode: string | undefined,
  method: DeliveryMethod,
): Minor {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const discount = discountFor(items, promoCode)
  const afterDiscount = Math.max(0, subtotal - discount)
  const code = promoCode?.trim().toUpperCase()
  if (code === 'FREESHIP') return 0
  if (method === 'standard' && afterDiscount >= FREE_DELIVERY_THRESHOLD) return 0
  return method === 'express' ? EXPRESS_DELIVERY : STANDARD_DELIVERY
}

function rebuild(partial?: Partial<CartState>): CartState {
  const next: CartState = {
    ...state,
    ...partial,
  }
  const items = next.items.map((item) => ({
    ...item,
    lineTotal: item.unitPrice * item.quantity,
  }))
  if (items.length === 0) {
    return {
      ...next,
      items: [],
      totals: emptyTotals(next.currency),
      itemCount: 0,
    }
  }
  const totals = computeTotals(items, {
    discount: discountFor(items, next.promoCode),
    delivery: deliveryFor(items, next.promoCode, next.deliveryMethod),
    cashFee: next.paymentKind === 'cash_on_delivery' ? CASH_FEE : 0,
    currency: next.currency,
  })
  return {
    ...next,
    items,
    totals,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

function commit(partial?: Partial<CartState>, emitUpdate = true) {
  state = rebuild(partial)
  persist()
  notify()
  if (emitUpdate) {
    emitSnapshot()
  }
}

export function emitSnapshot() {
  const snapshot: CartSnapshot = {
    items: state.items,
    itemCount: state.itemCount,
    totals: state.totals,
    promoCode: state.promoCode,
    updatedAt: new Date().toISOString(),
  }
  emit('cart:updated', 'cart', snapshot)
}

function toCartItem(payload: CartAddPayload, existing?: CartItem): CartItem {
  const max = payload.maxPerOrder ?? DEFAULT_MAX_PER_ORDER
  const nextQty = Math.min(max, (existing?.quantity ?? 0) + payload.quantity)
  return {
    productId: payload.productId,
    variantId: payload.variantId,
    name: payload.name,
    variantLabel: payload.variantLabel,
    imageUrl: payload.imageUrl,
    unitPrice: existing?.unitPrice ?? payload.unitPrice,
    compareAtPrice: existing?.compareAtPrice ?? payload.compareAtPrice,
    quantity: Math.max(1, nextQty),
    lineTotal: 0,
    available: true,
  }
}

function applyAdd(payload: CartAddPayload) {
  if (!payload || typeof payload !== 'object') return
  if (!payload.productId || !payload.variantId || payload.quantity < 1) return

  const key = lineKey(payload)
  const existing = state.items.find((item) => lineKey(item) === key)
  const incoming = toCartItem(payload, existing)
  const items = existing
    ? state.items.map((item) => (lineKey(item) === key ? incoming : item))
    : [...state.items, incoming]

  commit({ items, currency: payload.currency ?? state.currency })
}

export function setQuantity(productId: string, variantId: string, quantity: number) {
  const key = lineKey({ productId, variantId })
  if (quantity < 1) {
    commit({ items: state.items.filter((item) => lineKey(item) !== key) })
    return
  }
  const items = state.items.map((item) =>
    lineKey(item) === key
      ? { ...item, quantity: Math.min(DEFAULT_MAX_PER_ORDER, quantity) }
      : item,
  )
  commit({ items })
}

export function removeItem(productId: string, variantId: string) {
  const key = lineKey({ productId, variantId })
  commit({ items: state.items.filter((item) => lineKey(item) !== key) })
}

export function saveForLater(productId: string, variantId: string) {
  const key = lineKey({ productId, variantId })
  const item = state.items.find((entry) => lineKey(entry) === key)
  if (!item) return
  commit({
    items: state.items.filter((entry) => lineKey(entry) !== key),
    savedForLater: [...state.savedForLater.filter((entry) => lineKey(entry) !== key), item],
  })
}

export function moveSavedToCart(productId: string, variantId: string) {
  const key = lineKey({ productId, variantId })
  const item = state.savedForLater.find((entry) => lineKey(entry) === key)
  if (!item) return
  applyAdd({
    productId: item.productId,
    variantId: item.variantId,
    name: item.name,
    variantLabel: item.variantLabel,
    imageUrl: item.imageUrl,
    unitPrice: item.unitPrice,
    compareAtPrice: item.compareAtPrice,
    quantity: item.quantity,
    currency: state.currency,
  })
  commit({
    savedForLater: state.savedForLater.filter((entry) => lineKey(entry) !== key),
  })
}

export function applyPromo(code: string): 'applied' | 'invalid' | 'cleared' {
  const trimmed = code.trim().toUpperCase()
  if (!trimmed) {
    commit({ promoCode: undefined })
    return 'cleared'
  }
  if (!['WELCOME', 'SAVE10', 'FREESHIP'].includes(trimmed)) {
    return 'invalid'
  }
  commit({ promoCode: trimmed })
  return 'applied'
}

export function setDeliveryMethod(method: DeliveryMethod) {
  deliveryMethod = method
  commit({ deliveryMethod: method })
}

export function setPaymentKind(kind: PaymentKind) {
  paymentKind = kind
  commit({ paymentKind: kind })
}

export function clearCart() {
  commit({ items: [], promoCode: undefined })
}

export function amountToFreeDelivery(): Minor {
  if (state.deliveryMethod !== 'standard') return 0
  if (state.promoCode?.toUpperCase() === 'FREESHIP') return 0
  const afterDiscount = Math.max(0, state.totals.subtotal - state.totals.discount)
  return Math.max(0, FREE_DELIVERY_THRESHOLD - afterDiscount)
}

export function restoreRemovedItem(item: CartItem) {
  const existing = state.items.find((entry) => lineKey(entry) === lineKey(item))
  if (existing) {
    setQuantity(item.productId, item.variantId, existing.quantity + item.quantity)
    return
  }
  commit({ items: [...state.items, item] })
}

function hydrate() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as PersistedCart
    if (!Array.isArray(parsed.items)) return
    state = rebuild({
      items: parsed.items,
      savedForLater: Array.isArray(parsed.savedForLater) ? parsed.savedForLater : [],
      promoCode: parsed.promoCode,
      currency: parsed.currency === 'ILS' ? 'ILS' : 'USD',
    })
  } catch {
    state = rebuild({ items: [] })
  }
}

let initialized = false

export function initCartStore() {
  if (initialized) return
  initialized = true
  hydrate()
  notify()
  emitSnapshot()

  on('cart:add', (payload) => {
    applyAdd(payload)
  })
}

export function getCartState(): CartState {
  return state
}

export function subscribeCart(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useCart(): CartState {
  return useSyncExternalStore(subscribeCart, getCartState, getCartState)
}
