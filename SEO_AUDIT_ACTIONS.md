# SEO Audit Actions

This file tracks non-code items from the SEO audit for `desktop-web-widget.martinsulak.dev`.

## Completed In Code

- Main title tag adjusted to the recommended 50-60 character range.
- Main meta description adjusted to the recommended 120-160 character range.
- Clean canonical URLs added for the home, support, terms, privacy, and success pages.
- Hreflang links added for the English pages.
- Open Graph and X/Twitter card metadata expanded.
- JSON-LD expanded for `WebSite`, `WebPage`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, and support/contact pages.
- All HTML images now have `alt`, `width`, and `height` attributes.
- Large page images now use lightweight WebP variants.
- Internal links now use clean URLs instead of `.html` URLs.
- Sitemap updated with clean URLs, current `lastmod` dates, priorities, and image hints.
- `robots.txt` now blocks API endpoints and points to the sitemap.
- `llms.txt` added for AI search and answer engines.
- Vercel headers now include X-Robots-Tag rules for API and success pages, stronger security headers, and long-lived asset caching.
- Stripe success URL now points to `/success` to avoid a `.html` redirect.

## External Setup Still Required

These audit items require account or DNS access and should not be invented in source code:

- Add SPF and DMARC TXT records in the DNS provider for the domain if email is sent from this domain.
- Create and link official social profiles only after real brand accounts exist.
- Add Meta/Facebook Pixel only if paid social advertising or retargeting will actually be used.
- Add Google Business Profile, local business schema, phone, and address only if this product has a verified public business address and phone number.
- Continue link building by publishing the product on relevant software directories, creator portfolio pages, GitHub profiles, product launch pages, and documentation pages.

## Suggested Backlink Targets

- Martin Sulak portfolio project page
- GitHub profile or public website repository README
- Gumroad product description
- Product Hunt or alternative software launch page
- Indie Hackers, Reddit, Hacker News, or relevant Windows productivity communities
- Blog post explaining how to build a Windows desktop dashboard with live web widgets
