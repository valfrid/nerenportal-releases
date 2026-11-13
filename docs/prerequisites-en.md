# Before you install Family Portal

**Family preparation checklist** · Start with the [introduction](intro-en.md).

> **Not yet installable:** No signed, supported `v1.0.0` public release or complete self-service installer exists yet. The private pilot's staging and deployment scripts are not installation instructions.

## Essentials

- [ ] **One responsible adult/administrator.** They manage setup, additional devices, backups and technical recovery.
- [ ] **Your own Cloudflare account**, protected with multifactor authentication. Your family owns its Worker, D1 database and R2 storage.
- [ ] **A domain you control**, such as `family.example`. You can register it anywhere, but must be able to configure DNS for Cloudflare.
- [ ] **A modern phone or computer supporting passkeys.** The first adult device is enrolled through the secure setup flow.
- [ ] **Family names and roles.** Decide who is an adult/parent and who is a child, plus optional individual entry points and colors.
- [ ] **A safe place for recovery details** such as a password manager. Never place secrets in a public document or message.

## Optional integrations

| Service | Needed on day one? | Preparation |
| --- | --- | --- |
| Google Calendar | No | Google account with access to selected calendars, plus a Google Cloud project/OAuth client and Calendar API if enabled. Configure the exact redirect URI once your portal domain is known. |
| Shared home display | No | Tablet, small computer or display with an up-to-date browser; register the device with proper permissions. |
| AI assistant | No | Verified AI binding, service terms and usage/budget settings. |
| Location sharing | No | Explicit device consent for GPS; optional home coordinates for distance-from-home calculations. |
| Email, MCP and other services | No | Separate integrations, scopes, domain settings and possible additional costs. |

Your Google account does not have to be the same as your Cloudflare account. Do not require everyone in the family to share a Google password.

## Plan your domain

Example only — replace with your own:

| Address | Planned purpose |
| --- | --- |
| `family.example` | Main portal |
| `admin.family.example` | Protected administration |
| `wall.family.example` | Shared home display |
| `alex.family.example` | Personal entry point |
| `wish.family.example` | Optional guest-facing wishlist |

Subdomains select an entry point; **they do not authenticate a person**. Changing domains later may affect passkeys and Google OAuth callback addresses.

## Costs, privacy and recovery

- Cloudflare Workers, D1, R2 and AI can have usage limits and charges. Check the **current** account-specific pricing and quotas before setup; no free-tier allowance is promised here.
- Google services are optional and may have separate policies and billing/consent requirements.
- Keep tested backups. Reverting Worker code does **not** automatically restore D1/R2.
- Never commit API tokens, bootstrap codes, OAuth client secrets or encryption keys to GitHub or send them in screenshots or ordinary chat.
- Discuss children's data, access levels and location sharing as a family. GPS sharing must be voluntary.
- Version checks can be automatic; software installation will require a signed release, compatibility checks and an administrator's approval.

## Family planning sheet (fill in locally)

| Question | Your choice |
| --- | --- |
| Family name | |
| Domain | |
| First administrator | |
| Adults and children | |
| Shared display? | |
| Google Calendar? Who owns it? | |
| AI and GPS at launch? | |
| Backup owner | |
| Where are recovery credentials stored? | |

**Never enter passwords or secret keys into this sheet.**

Next: [Security keys and recovery](security-keys-en.md), then the [Planned installation walkthrough](installation-en.md) and the [GitHub Releases page](https://github.com/valfrid/nerenportal-releases/releases).
