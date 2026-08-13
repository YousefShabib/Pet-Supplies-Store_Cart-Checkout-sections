/**
 * PawPantry Integration Contracts
 * Group 8 — Pet Supplies Store
 *
 * Changelog
 * - 1.0.0  Initial shared contract (August 2026)
 *
 * Copy this file, unchanged, into all four repos:
 *   shell/src/contracts.ts
 *   catalog/src/contracts.ts
 *   cart-checkout/src/contracts.ts
 *   account/src/contracts.ts
 *
 * Rules
 * - Never edit this file alone. Any change is agreed by all three members first.
 * - Changes must be additive. Add optional fields. Never rename, retype, or remove.
 * - Bump CONTRACT_VERSION on every change and record it in the changelog above.
 * - All money is an integer in minor units. 34.90 is stored as 3490. Never a float.
 * - All ids are strings, even when they look like numbers.
 */

export const CONTRACT_VERSION = '1.0.0'

export const CART_STORAGE_KEY = 'pawpantry.cart.v1'

export type Minor = number
export type CurrencyCode = 'ILS' | 'USD'
export type IsoDateTime = string
export type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'small_pet' | 'reptile'

export type EventSource = 'shell' | 'catalog' | 'cart' | 'account'
export type EventName = 'cart:add' | 'cart:updated' | 'order:placed' | 'auth:changed'

export interface EventEnvelope<T> {
  v: string
  source: EventSource
  eventId: string
  at: IsoDateTime
  payload: T
}

export interface ProductVariant {
  variantId: string
  label: string
  price: Minor
  compareAtPrice?: Minor
  stock: number
  sku?: string
  weightGrams?: number
}

export interface Product {
  productId: string
  name: string
  brand: string
  imageUrl: string
  currency: CurrencyCode
  petTypes: PetType[]
  slug: string
  variants: ProductVariant[]
  rating?: number
  reviewCount?: number
  maxPerOrder?: number
}

export interface CartItem {
  productId: string
  variantId: string
  name: string
  variantLabel: string
  imageUrl: string
  unitPrice: Minor
  compareAtPrice?: Minor
  quantity: number
  lineTotal: Minor
  available: boolean
}

export interface CartTotals {
  subtotal: Minor
  discount: Minor
  delivery: Minor
  cashFee: Minor
  total: Minor
  currency: CurrencyCode
}

export interface Address {
  addressId?: string
  label: 'home' | 'work' | 'other'
  isDefault: boolean
  recipientName: string
  phone: string
  governorate: string
  city: string
  street: string
  building?: string
  floor?: string
  landmark?: string
  notes?: string
}

export interface UserProfile {
  userId: string
  fullName: string
  email: string
  phone?: string
  avatarUrl?: string
  emailVerified: boolean
}

export interface PaymentMethodSummary {
  kind: 'card' | 'cash_on_delivery' | 'wallet'
  brand?: 'visa' | 'mastercard'
  last4?: string
}

export interface Order {
  orderId: string
  orderNumber: string
  status: 'processing' | 'in_transit' | 'delivered' | 'cancelled'
  placedAt: IsoDateTime
  items: CartItem[]
  totals: CartTotals
  shippingAddress: Address
  deliveryMethod: 'standard' | 'express'
  payment: PaymentMethodSummary
  estimatedDeliveryFrom?: IsoDateTime
  estimatedDeliveryTo?: IsoDateTime
}

export interface CartAddPayload {
  productId: string
  variantId: string
  name: string
  variantLabel: string
  imageUrl: string
  unitPrice: Minor
  compareAtPrice?: Minor
  quantity: number
  currency: CurrencyCode
  subscription?: {
    enabled: boolean
    intervalWeeks: 2 | 4 | 8
  }
  maxPerOrder?: number
}

export interface CartSnapshot {
  items: CartItem[]
  itemCount: number
  totals: CartTotals
  promoCode?: string
  updatedAt: IsoDateTime
}

export interface OrderPlacedPayload {
  order: Order
}

export interface AuthChangedPayload {
  signedIn: boolean
  user?: UserProfile
  addresses?: Address[]
  reason: 'sign_in' | 'sign_out' | 'session_restored' | 'session_expired'
}

export type EventPayloadMap = {
  'cart:add': CartAddPayload
  'cart:updated': CartSnapshot
  'order:placed': OrderPlacedPayload
  'auth:changed': AuthChangedPayload
}

const REPLAYABLE: EventName[] = ['cart:updated', 'auth:changed']

const lastByEvent = new Map<EventName, EventEnvelope<unknown>>()
const seenEventIds = new Set<string>()

function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function emit<K extends EventName>(
  name: K,
  source: EventSource,
  payload: EventPayloadMap[K],
): void {
  const envelope: EventEnvelope<EventPayloadMap[K]> = {
    v: CONTRACT_VERSION,
    source,
    eventId: newEventId(),
    at: new Date().toISOString(),
    payload,
  }

  if (REPLAYABLE.includes(name)) {
    lastByEvent.set(name, envelope as EventEnvelope<unknown>)
  }

  window.dispatchEvent(new CustomEvent(name, { detail: envelope }))
}

export function on<K extends EventName>(
  name: K,
  handler: (payload: EventPayloadMap[K], envelope: EventEnvelope<EventPayloadMap[K]>) => void,
): () => void {
  const listener = (event: Event) => {
    const custom = event as CustomEvent<EventEnvelope<EventPayloadMap[K]>>
    const envelope = custom.detail
    if (!envelope || typeof envelope !== 'object') return

    if (envelope.v && envelope.v !== CONTRACT_VERSION) {
      console.warn(
        `[pawpantry] contract version mismatch on ${name}: sender=${envelope.v} local=${CONTRACT_VERSION}. Sync contracts.ts.`,
      )
    }

    if (envelope.eventId) {
      if (seenEventIds.has(envelope.eventId)) return
      seenEventIds.add(envelope.eventId)
      if (seenEventIds.size > 500) {
        const first = seenEventIds.values().next().value
        if (first) seenEventIds.delete(first)
      }
    }

    try {
      handler(envelope.payload, envelope)
    } catch (error) {
      console.warn(`[pawpantry] handler for ${name} threw`, error)
    }
  }

  window.addEventListener(name, listener)

  const cached = lastByEvent.get(name) as EventEnvelope<EventPayloadMap[K]> | undefined
  if (cached) {
    queueMicrotask(() => {
      try {
        handler(cached.payload, cached)
      } catch (error) {
        console.warn(`[pawpantry] replay handler for ${name} threw`, error)
      }
    })
  }

  return () => window.removeEventListener(name, listener)
}

export function getLast<K extends EventName>(name: K): EventPayloadMap[K] | undefined {
  return lastByEvent.get(name)?.payload as EventPayloadMap[K] | undefined
}

export function computeTotals(
  items: CartItem[],
  opts?: {
    discount?: Minor
    delivery?: Minor
    cashFee?: Minor
    currency?: CurrencyCode
  },
): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const discount = opts?.discount ?? 0
  const delivery = opts?.delivery ?? 0
  const cashFee = opts?.cashFee ?? 0
  return {
    subtotal,
    discount,
    delivery,
    cashFee,
    total: Math.max(0, subtotal - discount + delivery + cashFee),
    currency: opts?.currency ?? 'USD',
  }
}

export function formatMoney(amount: Minor, currency: CurrencyCode): string {
  const value = amount / 100
  if (currency === 'ILS') {
    return `₪${value.toFixed(2)}`
  }
  return `$${value.toFixed(2)}`
}

export function lineKey(item: Pick<CartItem, 'productId' | 'variantId'>): string {
  return `${item.productId}::${item.variantId}`
}
