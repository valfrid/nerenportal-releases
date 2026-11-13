# Choosing a domain for Family Portal

[← Preparation](prerequisites-en.md) · [Installation](installation-en.md)

## Recommended default: .cc registered with Cloudflare

For a family **starting without a domain**, we recommend a short **`.cc`** name purchased through **Cloudflare Registrar**.

- **Short and memorable:** For example `example-family.cc` (illustrative only; availability has not been checked).
- **Fewer setup steps:** Cloudflare Registrar automatically uses Cloudflare nameservers, avoiding a manual nameserver change at another registrar.
- **One account:** Registration, DNS, Worker, D1 and R2 can be managed from the family's Cloudflare account.
- **Check the costs:** Availability, initial price and **renewal price** must be verified in Cloudflare's own purchase flow. Some names may be unavailable or premium.

**Important:** Cloudflare supports `.cc` registration in its **dashboard**, but currently **excludes `.cc` from programmatic registration through its Registrar API**. The wizard must guide the family through a manual dashboard purchase, then continue the rest of the installation. No domain should be bought without the family's explicit confirmation and payment.

[Open Cloudflare Registrar](https://dash.cloudflare.com/) · [Cloudflare's .cc overview](https://www.cloudflare.com/application-services/products/registrar/buy-cc-domains/)

## Already have a domain? Keep it.

An existing `.se`, `.com` or other domain can be used; **there is no need to buy a new `.cc`**.

Cloudflare DNS can handle a domain registered with a different registrar. Add the domain in Cloudflare, then normally update the authoritative nameservers at your existing registrar.

**Protect existing email:** Before changing DNS, verify that any existing MX, SPF, DKIM and DMARC records are preserved. Existing email or other services on the domain can be disrupted if DNS records are lost.

## Buying through another registrar

You may buy a `.se` or another domain from a registrar that sells it, then configure Cloudflare DNS separately.

Remember the distinction:

- **Cloudflare Registrar** sells and renews domain names; it supports many but not all country-code extensions.
- **Cloudflare DNS** can manage DNS for domains registered elsewhere.
- **Cloudflare Workers** runs the portal itself.

## How the wizard should guide families

1. Ask whether the family already owns a domain.
2. If not, recommend a short `.cc` through Cloudflare Registrar.
3. Offer example names **without falsely claiming availability**.
4. Link to Cloudflare's dashboard for manual registration, including price and renewal confirmation.
5. After purchase, verify the family's ownership and active zone in their account.
6. If a domain already exists, guide the family through Cloudflare DNS nameservers instead.

Cloudflare Registrar requires its registered domains to use Cloudflare nameservers. To switch away to another DNS provider later, the domain must first be transferred to another registrar.

### Why not promise that .cc is “the new .com”?

`.cc` is compact and fits Family Portal well, but “new `.com`” is a positioning phrase, not a proven industry-wide standard. It's a recommendation, never a requirement.

**Official sources:** [Cloudflare .cc registration](https://www.cloudflare.com/application-services/products/registrar/buy-cc-domains/), [Cloudflare Registrar API](https://developers.cloudflare.com/api/resources/registrar/), [Cloudflare nameserver guide](https://developers.cloudflare.com/dns/nameservers/update-nameservers/).
