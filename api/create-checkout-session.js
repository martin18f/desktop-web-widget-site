const PRODUCT_NAME = "Desktop Web Widget";
const DEFAULT_SITE_URL = "https://desktop-web-widget.martinsulak.dev";
const STRIPE_PRICE_EUR_CENTS = 330;

const sendJson = (response, statusCode, payload) => {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
};

const getSiteUrl = (request) => {
  const configuredUrl = process.env.SITE_URL || DEFAULT_SITE_URL;
  const origin = request.headers.origin;

  if (origin && origin.startsWith("http")) {
    return origin;
  }

  return configuredUrl;
};

module.exports = async (request, response) => {
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const allowedOrigins = new Set(
    (process.env.ALLOWED_ORIGINS || process.env.SITE_URL || DEFAULT_SITE_URL)
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  );

  const origin = request.headers.origin;

  if (origin && allowedOrigins.size > 0 && !allowedOrigins.has(origin)) {
    sendJson(response, 403, { error: "Origin not allowed" });
    return;
  }

  if (origin && allowedOrigins.has(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method === "GET") {
    sendJson(response, 200, { ready: Boolean(process.env.STRIPE_SECRET_KEY) });
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    sendJson(response, 500, { error: "Stripe is not configured" });
    return;
  }

  const siteUrl = getSiteUrl(request);

  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("payment_method_types[0]", "card");
  params.append("line_items[0][price_data][currency]", "eur");
  params.append("line_items[0][price_data][unit_amount]", String(STRIPE_PRICE_EUR_CENTS));
  params.append("line_items[0][price_data][product_data][name]", PRODUCT_NAME);
  params.append("line_items[0][price_data][product_data][description]", "Windows desktop app for pinning interactive web pages as desktop widgets.");
  params.append("line_items[0][quantity]", "1");
  params.append("success_url", `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`);
  params.append("cancel_url", `${siteUrl}/#pricing`);
  params.append("billing_address_collection", "auto");
  params.append("metadata[product]", "desktop-web-widget");
  params.append("metadata[delivery]", "manual");

  try {
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    const data = await stripeResponse.json();

    if (!stripeResponse.ok) {
      sendJson(response, stripeResponse.status, { error: data.error?.message || "Stripe checkout failed" });
      return;
    }

    sendJson(response, 200, { url: data.url });
  } catch (error) {
    sendJson(response, 500, { error: error.message || "Stripe checkout failed" });
  }
};
