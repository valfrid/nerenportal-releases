# Security keys and secrets — who creates them and where to keep them

[← Prerequisites](prerequisites-en.md) · [Installation guide](installation-en.md)

> **Status:** This is the design for the **planned** installation wizard, not an existing, working installer. Names below refer to the current application's code where applicable and may be adjusted before the first signed public release.

## Key principle

Each family owns its Cloudflare account and its data. The wizard should use a cryptographically secure random generator to create **unique secrets per family**, install them directly as Cloudflare Worker **Secrets** (not plaintext Vars), and keep values out of GitHub, frontend code and logs. Initial Cloudflare deployment permissions must be as narrow and short-lived as possible.

Cloudflare does not reveal a Secret value in the dashboard after it is stored. For keys required for disaster recovery, the wizard should therefore offer a **locally encrypted recovery package**, protected with a separate strong passphrase. The developer must not retain a central copy of family secrets.

## What gets created?

| Parameter / resource | Origin | Runtime storage | Recovery plan |
| --- | --- | --- | --- |
| Cloudflare account and `CLOUDFLARE_ACCOUNT_ID` | Family account; wizard discovers the ID after approval | Non-secret deployment metadata | Retain account ownership and recovery details |
| Temporary installation API token | Family approves narrow access | Short-lived installer context, **not** normal portal | Revoke when installation completes |
| Worker, D1 and R2 | Wizard provisions in family's account | Cloudflare bindings | Record resource IDs and data backup procedures |
| `BOOTSTRAP_SECRET` | Wizard-generated cryptographic random value | Worker Secret for initial passkey bootstrap | Disable/remove after completed enrollment if recovery design allows; create a new recovery code when needed |
| Passkey/WebAuthn | User's phone/computer generates credential | Private key stays on device; public credential metadata in D1 | Enroll a second trusted adult device where possible; never export private passkey to the wizard |
| `GOOGLE_CLIENT_ID` | Google Cloud OAuth client | Worker settings (ID generally not secret) | Record project and client IDs |
| `GOOGLE_CLIENT_SECRET` | Google Cloud OAuth client | Worker Secret | Keep in secure password manager/encrypted recovery package |
| `GOOGLE_TOKEN_ENCRYPTION_KEY` | Unique wizard-generated encryption secret | Worker Secret | **Critical:** store encrypted backup; losing or changing it without a token migration prevents decrypting saved Google OAuth tokens; reauthorization may be necessary |
| `RECIPE_MCP_TOKEN`, `CALENDAR_MCP_TOKEN` | Wizard-generated when enabled | Worker Secrets; securely entered into connected clients | Reissue/rotate as needed and update connected clients |
| `WISH_GUEST_CODE` | Wizard or adult picks unique guest code, if feature enabled | Worker Secret | Can be rotated; preserve wishlists |
| Backup encryption key (once implemented) | Wizard-generated | Family-controlled secure secret/backup storage | **Critical:** losing it may make encrypted backups unrecoverable |
| Future updater deployment token | Family separately grants minimal scope | Dedicated updater Secret, **not** ordinary portal Worker | Document revocation, rotation, recovery; never GitHub |
| Family domain, names, timezone, release number | Family choices | Normal configuration / D1 | Keep in non-secret installation report |

Development-only GitHub Action/staging tokens, such as `STAGING_CLOUDFLARE_API_TOKEN`, should **never** be copied from the private pilot into another family's installation.

## The wizard's Security step

Every value gets a small card explaining:

1. **Purpose** — e.g. “Protects Google Calendar OAuth tokens.”
2. **Creation** — “Generate automatically” or “Obtain from Google/Cloudflare.”
3. **Storage** — exact Worker Secret / dedicated updater service.
4. **Recovery consequence** — “Can regenerate”, “Google reconnect required”, or “Backup unrecoverable without this key”.
5. **Status** — *Not generated → Generated → Installed → Verified → Safely backed up if required*.

Families should **not** have to paste random 64-character keys into many Cloudflare fields. The wizard should create and install those keys through an authorized scoped session. When an important key must be archived, offer a **locally encrypted recovery export**; the passphrase should never be transmitted to the developer.

### Encrypted recovery package

Include: installation ID, Cloudflare resource IDs, domain, installed release, optional integration metadata, OAuth client information and long-lived secrets **only when genuinely needed for recovery**.

Exclude: temporary Cloudflare installation tokens, session cookies, private WebAuthn keys and D1/R2 family data (those require separate encrypted backups).

Keep at least two safe copies of the encrypted file and protect its decryption passphrase separately. Test restoring in an isolated environment.

## After installation: Security & Recovery

Admin should have a **Security & Recovery** section that reports status *without ever displaying stored secret values*: configured Cloudflare bindings, enrolled passkeys, OAuth connection, enabled MCP credentials, backup and restore-check status, updater permissions, last rotation and warning messages.

Key rotation should require fresh adult confirmation and show consequences. For example, rotating `GOOGLE_TOKEN_ENCRYPTION_KEY` without re-encrypting saved OAuth tokens will require reconnecting Google.

## Required implementation work

- Cryptographically secure secret generation with isolated per-family values.
- Least-privileged temporary installer authorization versus a separate updater authorization.
- Local encrypted recovery export without a central developer-held copy.
- Multiple registered adult passkeys and a tested recovery path.
- Tests to verify no secrets leak into GitHub, HTML, logs, API responses or normal D1 settings.

**Security setup and recoverability must be a required part of the real wizard, not an optional troubleshooting appendix.**
