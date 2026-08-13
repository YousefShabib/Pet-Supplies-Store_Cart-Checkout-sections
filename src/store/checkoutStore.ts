import { useSyncExternalStore } from 'react'
import type { Address, AuthChangedPayload, Order, PaymentMethodSummary, UserProfile } from '../contracts'
import { emit, on } from '../contracts'
import { clearCart, getCartState, type DeliveryMethod, type PaymentKind } from './cartStore'

export type PreferredTime = 'morning' | 'afternoon' | 'evening'

export interface ShippingForm {
  fullName: string
  phone: string
  email: string
  governorate: string
  city: string
  street: string
  building: string
  floor: string
  landmark: string
  notes: string
  preferredTime: PreferredTime
  saveAddress: boolean
}

export interface PaymentForm {
  nameOnCard: string
  cardNumber: string
  expiry: string
  cvv: string
  saveCard: boolean
  sameAsDelivery: boolean
  agreeTerms: boolean
}

export type ShippingErrors = Partial<Record<keyof ShippingForm, string>>

const CHECKOUT_KEY = 'pawpantry.checkout.v1'
const LAST_ORDER_KEY = 'pawpantry.lastOrder.v1'

export const emptyShipping = (): ShippingForm => ({
  fullName: '',
  phone: '',
  email: '',
  governorate: '',
  city: '',
  street: '',
  building: '',
  floor: '',
  landmark: '',
  notes: '',
  preferredTime: 'afternoon',
  saveAddress: true,
})

export const emptyPayment = (): PaymentForm => ({
  nameOnCard: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  saveCard: false,
  sameAsDelivery: true,
  agreeTerms: false,
})

interface CheckoutState {
  shipping: ShippingForm
  payment: PaymentForm
  signedIn: boolean
  user?: UserProfile
  addresses: Address[]
  lastOrder: Order | null
  cardError: string | null
  processing: boolean
}

const listeners = new Set<() => void>()

let state: CheckoutState = {
  shipping: emptyShipping(),
  payment: emptyPayment(),
  signedIn: false,
  addresses: [],
  lastOrder: null,
  cardError: null,
  processing: false,
}

function notify() {
  listeners.forEach((listener) => listener())
}

function persistCheckout() {
  localStorage.setItem(
    CHECKOUT_KEY,
    JSON.stringify({ shipping: state.shipping, payment: { ...state.payment, cvv: '', cardNumber: maskForPersist(state.payment.cardNumber) } }),
  )
}

function maskForPersist(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '')
  if (digits.length < 4) return ''
  return digits.slice(-4).padStart(Math.min(digits.length, 16), '•')
}

function hydrate() {
  try {
    const raw = localStorage.getItem(CHECKOUT_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { shipping?: ShippingForm; payment?: PaymentForm }
      state = {
        ...state,
        shipping: { ...emptyShipping(), ...parsed.shipping },
        payment: { ...emptyPayment(), ...parsed.payment, cvv: '' },
      }
    }
  } catch {
    /* ignore corrupt checkout draft */
  }
  try {
    const rawOrder = localStorage.getItem(LAST_ORDER_KEY)
    if (rawOrder) {
      state = { ...state, lastOrder: JSON.parse(rawOrder) as Order }
    }
  } catch {
    /* ignore */
  }
}

function commit(partial: Partial<CheckoutState>) {
  state = { ...state, ...partial }
  persistCheckout()
  notify()
}

export function updateShipping(patch: Partial<ShippingForm>) {
  commit({ shipping: { ...state.shipping, ...patch } })
}

export function updatePayment(patch: Partial<PaymentForm>) {
  commit({ payment: { ...state.payment, ...patch }, cardError: patch.cardNumber ? null : state.cardError })
}

export function setCardError(message: string | null) {
  commit({ cardError: message })
}

export function setProcessing(value: boolean) {
  state = { ...state, processing: value }
  notify()
}

export function validateShipping(form: ShippingForm = state.shipping): ShippingErrors {
  const errors: ShippingErrors = {}
  if (!form.fullName.trim()) errors.fullName = 'Full name is required.'
  if (!/^\+?[0-9]{8,15}$/.test(form.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Enter a valid phone number.'
  }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email or leave it blank.'
  }
  if (!form.governorate) errors.governorate = 'Select a governorate.'
  if (!form.city) errors.city = 'Select a city.'
  if (!form.street.trim()) errors.street = 'Street address is required.'
  return errors
}

export function shippingToAddress(form: ShippingForm): Address {
  return {
    label: 'home',
    isDefault: true,
    recipientName: form.fullName.trim(),
    phone: toE164(form.phone),
    governorate: form.governorate,
    city: form.city,
    street: form.street.trim(),
    building: form.building.trim() || undefined,
    floor: form.floor.trim() || undefined,
    landmark: form.landmark.trim() || undefined,
    notes: form.notes.trim() || undefined,
  }
}

function toE164(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('970')) return `+${digits}`
  if (digits.startsWith('0')) return `+970${digits.slice(1)}`
  return `+970${digits}`
}

function detectBrand(digits: string): 'visa' | 'mastercard' | undefined {
  if (digits.startsWith('4')) return 'visa'
  if (digits.startsWith('5')) return 'mastercard'
  return undefined
}

function paymentSummary(): PaymentMethodSummary {
  const kind: PaymentKind = getCartState().paymentKind
  if (kind === 'cash_on_delivery') return { kind }
  if (kind === 'wallet') return { kind }
  const digits = state.payment.cardNumber.replace(/\D/g, '')
  return {
    kind: 'card',
    brand: detectBrand(digits),
    last4: digits.slice(-4) || undefined,
  }
}

function addDays(iso: string, days: number): string {
  const date = new Date(iso)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString()
}

function nextOrderNumber(): string {
  const n = Math.floor(800 + Math.random() * 200)
  return `PET-2026-${String(n).padStart(4, '0')}`
}

export type PlaceOrderResult = 'success' | 'declined' | 'failed' | 'invalid'

export async function placeOrder(): Promise<{ result: PlaceOrderResult; order?: Order }> {
  const cart = getCartState()
  if (cart.items.length === 0 || cart.items.some((item) => !item.available)) {
    return { result: 'invalid' }
  }
  if (!state.payment.agreeTerms) return { result: 'invalid' }

  const kind = cart.paymentKind
  if (kind === 'card') {
    const digits = state.payment.cardNumber.replace(/\D/g, '')
    if (digits.length < 13 || !state.payment.nameOnCard.trim() || !state.payment.expiry || state.payment.cvv.length < 3) {
      setCardError('Please complete your card details.')
      return { result: 'invalid' }
    }
  }

  setProcessing(true)
  await new Promise((resolve) => setTimeout(resolve, 1600))

  if (kind === 'card') {
    const digits = state.payment.cardNumber.replace(/\D/g, '')
    if (digits.endsWith('0000')) {
      setProcessing(false)
      return { result: 'failed' }
    }
    if (!digits.endsWith('4242')) {
      setProcessing(false)
      setCardError('Card was declined.')
      return { result: 'declined' }
    }
  }

  const now = new Date().toISOString()
  const method: DeliveryMethod = cart.deliveryMethod
  const order: Order = {
    orderId: `ord_${Date.now()}`,
    orderNumber: nextOrderNumber(),
    status: 'processing',
    placedAt: now,
    items: cart.items.map((item) => ({ ...item })),
    totals: cart.totals,
    shippingAddress: shippingToAddress(state.shipping),
    deliveryMethod: method,
    payment: paymentSummary(),
    estimatedDeliveryFrom: addDays(now, method === 'express' ? 0 : 2),
    estimatedDeliveryTo: addDays(now, method === 'express' ? 1 : 3),
  }

  localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order))
  emit('order:placed', 'cart', { order })
  clearCart()
  setProcessing(false)
  commit({ lastOrder: order, cardError: null, payment: emptyPayment() })
  return { result: 'success', order }
}

function applyAuth(payload: AuthChangedPayload) {
  if (!payload || typeof payload !== 'object') return
  const signedIn = Boolean(payload.signedIn)
  const addresses = signedIn ? payload.addresses ?? [] : []
  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0]
  let shipping = state.shipping
  if (signedIn && defaultAddress && !shipping.street) {
    shipping = {
      ...shipping,
      fullName: defaultAddress.recipientName || payload.user?.fullName || '',
      phone: defaultAddress.phone || payload.user?.phone || '',
      email: payload.user?.email || '',
      governorate: defaultAddress.governorate,
      city: defaultAddress.city,
      street: defaultAddress.street,
      building: defaultAddress.building ?? '',
      floor: defaultAddress.floor ?? '',
      landmark: defaultAddress.landmark ?? '',
      notes: defaultAddress.notes ?? '',
    }
  } else if (signedIn && payload.user && !shipping.fullName) {
    shipping = {
      ...shipping,
      fullName: payload.user.fullName,
      phone: payload.user.phone ?? '',
      email: payload.user.email,
    }
  }
  commit({
    signedIn,
    user: signedIn ? payload.user : undefined,
    addresses,
    shipping,
  })
}

let initialized = false

export function initCheckoutStore() {
  if (initialized) return
  initialized = true
  hydrate()
  notify()
  on('auth:changed', (payload) => {
    applyAuth(payload)
  })
}

export function getCheckoutState(): CheckoutState {
  return state
}

export function subscribeCheckout(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useCheckout(): CheckoutState {
  return useSyncExternalStore(subscribeCheckout, getCheckoutState, getCheckoutState)
}

export function formatAddressLine(address: Address): string {
  return [address.street, address.building && `Bldg ${address.building}`, address.floor && `Fl ${address.floor}`, address.city, address.governorate]
    .filter(Boolean)
    .join(', ')
}
