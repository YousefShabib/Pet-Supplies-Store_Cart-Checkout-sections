# PawPantry Cart & Checkout

Microfrontend for **Group 8 — Pet Supplies Store**. This repo owns the shopping cart, shipping step, mocked payment, and order confirmation.

Standalone live URL: _add after deploy_

Shell integration custom element: `<pawpantry-cart></pawpantry-cart>`  
Bundle: `/wc.js` from the production build.

## What it does

- Shopping cart (populated, empty, mobile sticky checkout bar)
- Promo codes: `WELCOME` ($5 off), `SAVE10` (10%), `FREESHIP`
- Mini cart drawer, remove confirmation, leave-checkout dialog, snackbars
- Checkout shipping + payment + confirmation / failure
- Mocked card payment (see demo cards below)
- Persists cart to `localStorage` key `pawpantry.cart.v1` — **this app is the only writer**

## Stack

React 19 + TypeScript + Vite + MUI, themed to PawPantry (forest green + orange).

## Routes owned

| Route | Screen |
| --- | --- |
| `/cart` | Shopping cart |
| `/checkout/shipping` | Shipping information |
| `/checkout/payment` | Payment & review |
| `/checkout/success/:orderNumber` | Order confirmation |
| `/checkout/failed` | Order failure |

Cross-app handoffs (owned by other members, linked from here):

- Track order → `/account/orders/:orderNumber`
- Guest checkout → `/login?redirect=/checkout/shipping`
- Continue shopping / browse → `/`
- Wishlist → `/account/wishlist`
- Item name can later link to `/p/:productSlug`

## Events

Contract version: **1.0.0** (`src/contracts.ts` — copy unchanged into all four repos).

| Event | This app | Payload |
| --- | --- | --- |
| `cart:add` | **listens** | `CartAddPayload` from catalog |
| `cart:updated` | **emits** (full snapshot, never a diff) | `CartSnapshot` |
| `order:placed` | **emits** before emptying the cart | `{ order }` |
| `auth:changed` | **listens** | prefills shipping from `addresses` |

Money is integer minor units. `$24.99` is stored as `2499`.

## Run locally

```bash
npm install
npm run dev
```

Open the printed Vite URL. First load seeds a demo cart and a signed-in user (Jane Doe) so you can click through the Figma flow without the other apps.

### Demo harness (browser console)

```js
pawpantryDemo.add()       // catalog-style cart:add
pawpantryDemo.seed()      // add the three demo lines
pawpantryDemo.signIn()
pawpantryDemo.signOut()   // cart items are kept
```

### Demo payment cards

- `4242 4242 4242 4242` — success
- Any other valid-length card — declined (stays on payment, red alert)
- Card ending in `0000` — hard failure (`/checkout/failed`)

Cash on Delivery and Digital Wallet succeed. COD adds a $1.50 fee.

## Build

```bash
npm run build
npm run preview
```

The build emits the standalone SPA (`index.html`) and `wc.js` for the shell:

```html
<script type="module" src="https://YOUR_DEPLOY/wc.js"></script>
<pawpantry-cart></pawpantry-cart>
```

## Integration notes

- `cart:updated` and `auth:changed` replay to late-mounting listeners.
- After a successful payment this app emits `order:placed`, then `cart:updated` with an empty cart.
- The header badge must be updated by the **shell** from `cart:updated.itemCount`. This app never writes the shell badge itself.
- Full card numbers and CVV never appear in event payloads — only `PaymentMethodSummary.last4`.
