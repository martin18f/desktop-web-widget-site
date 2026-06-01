# Desktop Web Widget Website

Standalone product website for Desktop Web Widget.

## Checkout Options

The site currently uses Gumroad overlay checkout, Tatra banka QR payment, and a prepared direct card checkout option.

Gumroad product URL:

```text
https://martinsulak.gumroad.com/l/desktop-web-widget
```

Prices shown on the site:

```text
Tatra banka QR payment: €3.00
Direct card checkout: €3.09
Gumroad checkout: €4.29
```

Use HTTPS hosting for the live site so the Gumroad overlay and future payment gateway work reliably.

## Preview

Open `index.html` in a browser.

## Deploy To Vercel

1. Create a new GitHub repository for this folder.
2. Push the files.
3. Import the repository in Vercel.
4. Use the default static project settings.
5. Add your custom domain in Vercel Project Settings.

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

## Purchase Links

Current Gumroad link:

```text
https://martinsulak.gumroad.com/l/desktop-web-widget
```

QR payment is available in the pricing section. Direct card checkout is prepared, but its button stays disabled until payment setup is complete.

## Direct Payment Gateway Recommendation

Recommended order:

1. GoPay for Slovakia/Czech market and low percentage pricing.
2. Stripe Payment Links or Stripe Checkout for the fastest international setup.
3. Comgate as another regional alternative.

The QR payment card currently shows `€3.00` and uses `assets/qrcode.jpeg`. The direct card checkout card currently shows `€3.09` as a GoPay-oriented estimate. After choosing a provider, replace the disabled direct checkout button in `index.html` with the provider checkout link or checkout script.

QR payments are manual. After payment, the buyer sends confirmation to the support email and receives the installer plus PDF manual after confirmation.
