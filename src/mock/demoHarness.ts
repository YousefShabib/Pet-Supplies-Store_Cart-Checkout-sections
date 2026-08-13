import type { Address, AuthChangedPayload, CartAddPayload, UserProfile } from '../contracts'
import { emit } from '../contracts'
import { CART_STORAGE_KEY } from '../contracts'
import { getCartState } from '../store/cartStore'

export const DEMO_CART_ITEMS: CartAddPayload[] = [
  {
    productId: 'p_premium_cat_food',
    variantId: 'v_salmon_3kg',
    name: 'Premium Dry Cat Food',
    variantLabel: 'Salmon & Rice - 3 kg',
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9fec119?auto=format&fit=crop&w=400&q=80',
    unitPrice: 2499,
    compareAtPrice: 2999,
    quantity: 1,
    currency: 'USD',
  },
  {
    productId: 'p_organic_dog_food',
    variantId: 'v_chicken_5lb',
    name: 'Organic Chicken Dry Dog Food',
    variantLabel: 'Chicken - 5 lbs',
    imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=400&q=80',
    unitPrice: 3299,
    quantity: 1,
    currency: 'USD',
  },
  {
    productId: 'p_rope_toy',
    variantId: 'v_rope_std',
    name: 'Tough Rope Chew Toy',
    variantLabel: 'Natural hemp - Standard',
    imageUrl: 'https://images.unsplash.com/photo-1535294439411-31b0b3942d2c?auto=format&fit=crop&w=400&q=80',
    unitPrice: 1299,
    quantity: 2,
    currency: 'USD',
  },
]

export const RECOMMENDED_PRODUCTS: CartAddPayload[] = [
  {
    productId: 'p_catnip_mouse',
    variantId: 'v_mouse_std',
    name: 'Catnip Mouse Toy',
    variantLabel: 'Set of 3',
    imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=400&q=80',
    unitPrice: 899,
    quantity: 1,
    currency: 'USD',
  },
  {
    productId: 'p_steel_bowl',
    variantId: 'v_bowl_med',
    name: 'Stainless Steel Bowl',
    variantLabel: 'Medium - 700 ml',
    imageUrl: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=400&q=80',
    unitPrice: 1499,
    quantity: 1,
    currency: 'USD',
  },
  {
    productId: 'p_dental_chews',
    variantId: 'v_chews_7',
    name: 'Dental Chews',
    variantLabel: '7-day pack',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80',
    unitPrice: 1199,
    compareAtPrice: 1499,
    quantity: 1,
    currency: 'USD',
  },
  {
    productId: 'p_grooming_brush',
    variantId: 'v_brush_std',
    name: 'Gentle Grooming Brush',
    variantLabel: 'Cats & small dogs',
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
    unitPrice: 1599,
    quantity: 1,
    currency: 'USD',
  },
]

const demoUser: UserProfile = {
  userId: 'u_jane',
  fullName: 'Jane Doe',
  email: 'jane@pawpantry.demo',
  phone: '+970591234567',
  emailVerified: true,
}

const demoAddress: Address = {
  addressId: 'addr_home',
  label: 'home',
  isDefault: true,
  recipientName: 'Jane Doe',
  phone: '+970591234567',
  governorate: 'Ramallah and Al-Bireh',
  city: 'Ramallah',
  street: 'Al-Irsal Street',
  building: '12',
  floor: '3',
  landmark: 'Near City Inn',
}

export function simulateSignedIn(reason: AuthChangedPayload['reason'] = 'session_restored') {
  emit('auth:changed', 'account', {
    signedIn: true,
    user: demoUser,
    addresses: [demoAddress],
    reason,
  })
}

export function simulateSignedOut() {
  emit('auth:changed', 'account', {
    signedIn: false,
    reason: 'sign_out',
  })
}

export function simulateCatalogAdd(item: CartAddPayload = DEMO_CART_ITEMS[0]) {
  emit('cart:add', 'catalog', item)
}

export function seedDemoCartIfEmpty() {
  const existing = localStorage.getItem(CART_STORAGE_KEY)
  if (existing) return
  if (getCartState().items.length > 0) return
  DEMO_CART_ITEMS.forEach((item) => emit('cart:add', 'catalog', item))
}

let harnessStarted = false

export let isSeeding = false

export function initDemoHarness() {
  if (harnessStarted) return
  harnessStarted = true
  isSeeding = true
  seedDemoCartIfEmpty()
  simulateSignedIn('session_restored')
  isSeeding = false

  const api = {
    add: simulateCatalogAdd,
    signIn: simulateSignedIn,
    signOut: simulateSignedOut,
    seed: () => DEMO_CART_ITEMS.forEach((item) => emit('cart:add', 'catalog', item)),
  }

  Object.assign(window, { pawpantryDemo: api })
  console.info(
    '[PawPantry demo] window.pawpantryDemo.add() | .signIn() | .signOut() | .seed()',
  )
}
