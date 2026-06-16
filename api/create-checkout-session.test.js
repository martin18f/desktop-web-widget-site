const test = require("node:test");
const assert = require("node:assert/strict");
const handler = require("./create-checkout-session");

function invokeHandler({
  method = "GET",
  origin,
  allowedOrigins,
  secretKey,
  siteUrl
} = {}) {
  const previousEnvironment = {
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    SITE_URL: process.env.SITE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
  };
  const restoreEnvironment = () => {
    for (const [name, value] of Object.entries(previousEnvironment)) {
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
  };

  if (allowedOrigins === undefined) {
    delete process.env.ALLOWED_ORIGINS;
  } else {
    process.env.ALLOWED_ORIGINS = allowedOrigins;
  }

  if (siteUrl === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = siteUrl;
  }

  if (secretKey === undefined) {
    delete process.env.STRIPE_SECRET_KEY;
  } else {
    process.env.STRIPE_SECRET_KEY = secretKey;
  }

  const headers = {};
  const request = {
    method,
    headers: origin ? { origin } : {}
  };

  return new Promise((resolve, reject) => {
    const response = {
      statusCode: 200,
      setHeader(name, value) {
        headers[name.toLowerCase()] = value;
      },
      end(body = "") {
        restoreEnvironment();

        resolve({
          body: body ? JSON.parse(body) : null,
          headers,
          statusCode: this.statusCode
        });
      }
    };

    Promise.resolve(handler(request, response)).catch((error) => {
      restoreEnvironment();
      reject(error);
    });
  });
}

test("checkout readiness reports missing Stripe configuration", async () => {
  const result = await invokeHandler();

  assert.equal(result.statusCode, 200);
  assert.equal(result.headers["cache-control"], "no-store");
  assert.deepEqual(result.body, {
    ready: false
  });
});

test("checkout rejects origins outside the allowlist", async () => {
  const result = await invokeHandler({
    origin: "https://malicious.example",
    allowedOrigins: "https://desktop-web-widget.martinsulak.dev"
  });

  assert.equal(result.statusCode, 403);
  assert.equal(result.body.error, "Origin not allowed");
});

test("checkout creates the expected Stripe session", async () => {
  const originalFetch = global.fetch;
  let requestBody;

  global.fetch = async (url, options) => {
    requestBody = new URLSearchParams(options.body);

    assert.equal(url, "https://api.stripe.com/v1/checkout/sessions");
    assert.equal(options.headers.Authorization, "Bearer sk_test");

    return {
      ok: true,
      status: 200,
      async json() {
        return {
          url: "https://checkout.stripe.com/example"
        };
      }
    };
  };

  try {
    const result = await invokeHandler({
      method: "POST",
      origin: "https://desktop-web-widget.martinsulak.dev",
      allowedOrigins: "https://desktop-web-widget.martinsulak.dev",
      secretKey: "sk_test",
      siteUrl: "https://desktop-web-widget.martinsulak.dev"
    });

    assert.equal(result.statusCode, 200);
    assert.equal(result.body.url, "https://checkout.stripe.com/example");
    assert.equal(requestBody.get("line_items[0][price_data][unit_amount]"), "330");
    assert.equal(
      requestBody.get("success_url"),
      "https://desktop-web-widget.martinsulak.dev/success?session_id={CHECKOUT_SESSION_ID}"
    );
  } finally {
    global.fetch = originalFetch;
  }
});
