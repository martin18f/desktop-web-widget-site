# Desktop Web Widget Website

Standalone product website for Desktop Web Widget.

## Checkout Options

The site currently uses Tatra banka QR payment, Stripe Checkout, and Gumroad overlay checkout.

Gumroad product URL:

```text
https://martinsulak.gumroad.com/l/desktop-web-widget
```

Prices shown on the site:

```text
Tatra banka QR payment: €3.00
Stripe Checkout: €3.09
Gumroad checkout: €4.29
```

Use HTTPS hosting for the live site so Stripe Checkout and Gumroad overlay checkout work reliably.

## Preview

Open `index.html` in a browser.

## Deploy To Vercel

1. Create a new GitHub repository for this folder.
2. Push the files.
3. Import the repository in Vercel.
4. Add the Stripe environment variables listed below.
5. Use the default static project settings.
6. Add your custom domain in Vercel Project Settings.

## Deploy To GitHub Pages

The prepared production domain is:

```text
https://desktop-web-widget.martinsulak.dev/
```

1. Create a public GitHub repository for this website.
2. Push this folder to the repository.
3. Open repository settings.
4. Enable GitHub Pages from the `main` branch root.
5. Keep the included `CNAME` file in the repository root.
6. Add this DNS record at the domain provider:

```text
Type: CNAME
Name: desktop-web-widget
Value: martin18f.github.io
```

7. Wait for DNS propagation, then enable HTTPS in GitHub Pages settings.

GitHub Pages can host the static website, but it cannot run the Stripe serverless API endpoint. Use Vercel for the live Stripe Checkout version.

## Purchase Links

Current Gumroad link:

```text
https://martinsulak.gumroad.com/l/desktop-web-widget
```

QR payment, Stripe Checkout, and Gumroad are available in the pricing section.

## Stripe Checkout

The Stripe button uses a serverless API endpoint:

```text
api/create-checkout-session.js
```

Set these environment variables in Vercel:

```text
STRIPE_SECRET_KEY=sk_live_...
SITE_URL=https://desktop-web-widget.martinsulak.dev
ALLOWED_ORIGINS=https://desktop-web-widget.martinsulak.dev
STRIPE_PRICE_EUR_CENTS=309
```

Never commit `STRIPE_SECRET_KEY` to the repository. The publishable key is not required for the current Stripe-hosted Checkout redirect flow.

QR payments are manual. After payment, the buyer sends confirmation to the support email and receives the installer plus PDF manual after confirmation.
