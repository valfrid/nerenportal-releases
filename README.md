# Family Portal — Verified Releases

Public release channel for the generic **Family Portal** (Familjeportalen).

> **Status:** Distribution infrastructure is being prepared. **There is no supported release to install yet.** Do not attempt installation or upgrade until a signed, tested release is published here.

## Try the installation wizard (offline demo)

**[Installation Wizard Demo — open/download HTML](demo/install-wizard.html)**

A self-contained, bilingual (Swedish/English) six-step prototype covering family details, simulated Cloudflare Worker/D1/R2 setup, optional services, security-key explanations, and a final dry-run installation summary.

**This is deliberately not connected to Cloudflare:** no API tokens, no OAuth, no network requests, no server-side storage, no secret generation and no cloud modifications. GitHub displays HTML as source; **download the file as `install-wizard.html` and open it in a modern browser** to run the interactive demo. The full prototype is one HTML file without external dependencies.

This demo is not a signed production installer and should not be used to deploy a real family portal.

## Getting started / Kom igång

**Svenska**

1. [Introduktion – vad Familjeportalen är](docs/introduktion-sv.md)
2. [Förberedelser – allt ni behöver veta innan installation](docs/forberedelser-sv.md)
3. [Installationsguide – det planerade steget för steg-flödet](docs/installationsguide-sv.md)
4. [Säkerhetsnycklar – skapa, lagra och återställa](docs/sakerhet-och-nycklar-sv.md)

**English**

1. [Introduction – what Family Portal does](docs/intro-en.md)
2. [Preparation checklist – accounts, domain, family settings and safety](docs/prerequisites-en.md)
3. [Planned installation walkthrough](docs/installation-en.md)
4. [Security keys — generation, storage, rotation and recovery](docs/security-keys-en.md)

**Important:** These guides are for planning and preparation. No public installer or stable release exists yet. When installation becomes available, the release page will contain version-specific verified instructions.

## What this repository contains

Once releases are ready, each immutable `vMAJOR.MINOR.PATCH` GitHub Release will include:

- A reviewed, family-neutral Cloudflare Worker + web assets distribution package.
- A versioned `release-manifest.json` specifying compatibility and the SHA-256 digest of every asset.
- An independently verifiable signature for the release manifest.
- Reviewed D1 migrations, release notes, and an upgrade/rollback compatibility statement.

**Only explicit GitHub Releases are installable.** Do not treat the default branch, a moving archive, or an unverified tag as executable updates.

## How families will receive updates

The family's own Worker checks this repository for new releases (without transmitting family data). A parent/admin can review the changelog and **explicitly approve** an update. A separately authorized deployment component verifies the signature and digest, checks compatibility, creates a backup, and deploys only into that family's own Cloudflare account.

The planned update mechanism does **not** require or use access to the private source repository. GitHub release metadata can be checked without a GitHub token.

## Privacy and security

This repository must **never** contain:

- Family D1 data, private R2 images, calendars, API tokens, passkeys, or OAuth credentials.
- Pilot-specific Wrangler configuration, Cloudflare account IDs, private domains, or populated database exports.
- Unreviewed archive dumps of the private development repository.

An update can replace Worker code, but **cannot automatically roll back D1/R2 data**. Migration and backup strategies are required for every release.

## Versioning

| Pattern | Meaning |
| --- | --- |
| `v1.0.0` | First verified installable public release (not yet published) |
| `v1.0.1` | Backward-compatible patch |
| `v1.1.0` | Backward-compatible feature update |
| `v2.0.0` | Potentially breaking change with explicit migration plan |
| `v1.1.0-rc.1` | Pre-release; never delivered as `stable` |

**No release or package is considered valid until all checks, signatures, isolated installation tests, and approval gates have passed.**

## Development

Development and Nerén's existing pilot deployment live in a **separate private repository**. Only audited, family-neutral build outputs are published here.

The release format, installer, updater service, and end-to-end migration tests are being developed separately. They are not yet available in this repository.
