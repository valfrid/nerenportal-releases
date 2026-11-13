# Install Family Portal — planned walkthrough

[← Preparation checklist](prerequisites-en.md) · [Introduction](intro-en.md)

> **Not available yet:** This describes the intended **future stable installation flow**. There is no supported signed public package, general bootstrap installer or complete updater yet. Do not run the private pilot's staging, migration or deployment scripts in a new family account. Exact step-by-step commands and UI instructions will accompany the first tested public release.

## At a glance

```text
1. Prepare family and accounts
             ↓
2. Choose a signed public GitHub Release
             ↓
3. Connect your own Cloudflare account and domain
             ↓
4. Provision isolated Worker, D1 and R2
             ↓
5. Register the first adult's device with a passkey
             ↓
6. Add members and optional integrations
             ↓
7. Test, back up and enable update checks
```

Families should not need the private development repository. The installer may need narrowly scoped, temporary Cloudflare deployment permissions; they must not appear in ordinary web pages or be left in the normal portal frontend.

## Step 1 — prepare ownership and domain

Set up your Cloudflare account with strong sign-in and control a domain. The domain can be registered elsewhere, as long as you can configure DNS for Cloudflare.

Decide on the main domain and optional subdomains for administration, a home display and family members. Every address must resolve to **your installation**, not a shared demo or another family's pilot.

Fill out the [planning checklist](prerequisites-en.md), without including secrets.

## Step 2 — choose a trustworthy release

Open [Public GitHub Releases](https://github.com/valfrid/nerenportal-releases/releases).

- Select a published, supported **stable** version that explicitly supports a new installation.
- Review required bindings, schema version and migrations.
- The installer must independently verify the manifest's signature with a trusted pinned key and check each artifact's SHA-256 before installation.
- If no supported signed stable release is available, **stop here**. Do not install from a branch archive or an unverified ZIP.

## Step 3 — provision your own Cloudflare resources

The planned installer will create or verify your Cloudflare Worker, static PWA assets, D1 database, R2 image bucket, and required bindings. It will report resource names and scopes before deploying.

A new family starts with **empty family data**. The installer must never import historical data, email addresses, or one-time migrations from the original private pilot.

Keep a unique installation ID and make sure you understand any account costs and limits.

## Step 4 — enroll your first adult securely

Use a short-lived bootstrap mechanism to register the first parent/admin with a passkey (device PIN, fingerprint or equivalent).

Choose the real adult's name; there must not be a hard-coded sample parent. Confirm that unknown devices cannot access Admin and add a second authorized adult device for recovery if applicable. Revoke the one-time bootstrap path after successful enrollment.

## Step 5 — configure the family

Use the protected Admin page to add adults, children, personal entry points, calendars (if connected), task categories, allowance rules and family lists.

Begin with a small test: make a task and shopping list, sign in on another authorized device, and verify a child's account cannot reach administrator data or hidden gift reservations.

## Step 6 — choose integrations

**Google Calendar (optional):** Configure a Google Cloud project and a **Web application** OAuth client. The exact redirect URI is displayed by *your* Admin → Integrations page. Grant only the necessary calendar scope and keep client secrets in Cloudflare Secrets. The portal should still work when Google is not connected.

**AI (optional):** Enable only after the Cloudflare AI binding, service limits and billing implications have been reviewed.

**Location sharing (optional):** Each person must explicitly opt in. Configure home coordinates only if distance-from-home is desired.

**Shared screen (optional):** Enroll the display as its own device with limited permissions.

## Step 7 — acceptance checklist

- [ ] Portal and personal entry points load over HTTPS.
- [ ] Unregistered browsers cannot access protected HTML or private APIs.
- [ ] Parent/admin passkey works and child roles cannot open Admin.
- [ ] A task and list can be created, saved and read back.
- [ ] Images can be uploaded and retrieved using this family's R2 bucket.
- [ ] Optional Google Calendar shows correct calendars and permissions.
- [ ] Backup exists **and a restore has been tested** separately.
- [ ] Admin shows the actual installed release and update-check status.
- [ ] No deployment tokens exist in normal frontend or browser storage.

## Future upgrades and recovery

The installed Worker will check public release metadata roughly daily. **It will not silently deploy new code.** A parent/admin reviews and approves the version through a separate authorized updater that verifies signatures, checks compatibility, backs up data and performs reviewed migrations.

Reverting Worker code **does not automatically restore D1 or R2**. Database changes require a separate safe migration/restore plan.

## Troubleshooting checklist

| Symptom | Check |
| --- | --- |
| Passkey sign-in fails | Correct domain/origin and a passkey enrolled for that domain. |
| Admin access denied | Sign in with an authorized parent/admin device. |
| Calendar is empty | Google is optional; check OAuth, Calendar API, redirect URI and calendar IDs. |
| Product or avatar images missing | Check the exact R2 binding and objects in the family's bucket. |
| No updates shown | A supported stable release must exist, and release polling must have succeeded. |
| Setup interrupted | Use the installer's documented resume/recovery flow; never guess or paste old secrets. |

Once the first stable package and installer pass end-to-end tests, this page will be updated with actual click-by-click directions and verified screenshots.
