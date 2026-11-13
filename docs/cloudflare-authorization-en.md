# How can the installer configure another family's Cloudflare account?

[← Domain choices](domain-choice-en.md) · [← Security and recovery](security-keys-en.md)

> **Status, 13 November 2026:** The public GitHub Pages wizard is still an **offline demonstration**. An isolated technical workers.dev provisioner exists in the private development repository, but a public OAuth installer backend has not been implemented.

## The public release repository has no deployment authority

`valfrid/nerenportal-releases` distributes public documentation and, eventually, **signed packages**. It does **not** have a universal Cloudflare API token. GitHub Pages is static hosting and cannot be allowed to collect or expose permanent deployment credentials.

A GitHub Actions secret is scoped to the workflow's GitHub repository and does not give permission to edit arbitrary Cloudflare accounts. Every family must grant its **own** specific authorization.

## Preferred: Cloudflare self-managed public OAuth application

Since **3 June 2026**, Cloudflare supports third-party OAuth apps with public visibility. We can register a verified **Family Portal Installer** app whose users choose a Cloudflare account and approve restricted scopes.

The intended flow:

1. Choose and, if needed, buy a domain first. Domainless `workers.dev` setup is also supported.
2. Click **Connect Cloudflare** and sign in at Cloudflare.
3. Review the app publisher, selected account(s), and requested permissions on the **Cloudflare consent page**.
4. Approve an authorization-code flow (PKCE for public clients; a secure server-side code flow can also be used).
5. A **separate installation backend** verifies permission, signed artifacts and existing resources, and creates the family's Worker, D1, R2 and optional zone routes *only in the authorized account*.
6. End the installer's authority after completion; use an independently designed, limited authorization for later updates.

**Public OAuth client registration requires a verified publisher domain**, proven by a DNS TXT record. A controlled custom domain such as `install.neren.cc` is appropriate, even if the frontend is hosted by GitHub Pages. Public GitHub files alone cannot substitute for domain verification.

Exact scopes must be reviewed carefully. Creating a *new* Worker can require Workers product-level Admin rights, while updating an existing Worker can be restricted more tightly. DNS/route permissions are needed only for a family's chosen zone. Cloudflare never grants access to an unrelated account without the account owner's authorization.

The backend must protect installation sessions and short-lived credentials. **Do not embed a client secret or a long-lived deployment credential in the public HTML.**

## Fallback: family-generated temporary API token

If OAuth is not ready, an adult can create an explicitly scoped, expiring API token for their own account in Cloudflare and hand it to a **trusted installation backend**, not to a public repository or insecure page. Revoke the token after deployment. Never request the Cloudflare Global API Key. Do not store all families' tokens as developer-owned GitHub Actions secrets.

Cloudflare Registrar `.cc` purchases still require the dashboard; the Registrar API does not support that extension at this time.

## Choosing versus generating security values

The real wizard can allow adults to choose strong **bootstrap passphrases**, **wish-list guest access codes**, and a **recovery export passphrase**. It must validate strength before accepting them. Encryption keys such as `GOOGLE_TOKEN_ENCRYPTION_KEY` and OAuth/service access tokens should be generated with a cryptographic random source.

The current GitHub Pages demo records *only the chosen method*, never a real password or token.

## Official references

- [Cloudflare self-managed OAuth announcement](https://developers.cloudflare.com/changelog/post/2026-06-03-public-oauth-clients/)
- [Create an OAuth client and verify the publisher domain](https://developers.cloudflare.com/fundamentals/oauth/create-an-oauth-client/)
- [Third-party authorization and account consent](https://developers.cloudflare.com/fundamentals/oauth/authorizing-an-application/)
- [Worker permissions and scoped tokens](https://developers.cloudflare.com/workers/authorization/)
- [Cloudflare Registrar API and .cc restrictions](https://developers.cloudflare.com/api/resources/registrar/)
