# Welcome to Family Portal

**One shared place for everyday family life — on your phones and at home.**

Family Portal is a private web application for keeping track of family activities, tasks, meals, messages and more. It works both on a shared home display and on each person's phone. Each family has **its own installation and ownership of its data**.

> **Project status:** The generic family edition is still being tested. There is **no supported, signed public installable release yet**. This is an introduction to the intended product, not a claim that self-service installation is available today.

## What can we use it for?

| Area | Examples |
| --- | --- |
| **Today and calendars** | See upcoming events and the family's week. Google Calendar can be connected separately. |
| **Tasks** | Recurring chores, personal tasks and optional extra jobs. |
| **Allowance** | Manage children's spending, savings and optional task requirements. |
| **Meals and shopping** | Plan lunch and dinner, keep recipes and share shopping lists. |
| **Messages** | Short messages between family members. |
| **Wishlists** | Keep gift ideas; a guest page can support discreet reservations. |
| **Kiosk** | A small family shop with your own items and prices. |
| **Where is everyone?** | Upcoming activities and voluntary, time-limited location sharing. |

Adults get configuration controls that are not available to children. **AI, Google integration, location sharing and third-party services are optional** and may have separate availability, permissions or costs.

## How does it work?

**Phones:** Each person has a personal entry point. The portal is a *progressive web app (PWA)* and can be added to a phone's home screen.

**Shared display:** A browser on a tablet or home screen can show an overview of family plans, meals and lists. Shared devices need appropriate access.

**Administration:** A parent/admin securely manages family members, calendars, settings and devices. Sign-in uses a passkey on a supported device.

## Who owns our information?

Each family uses its **own Cloudflare account**: D1 for application data and, where required, R2 for images. A connected Google Calendar remains in the Google account that owns it.

- Families do not share a database.
- Normal release checks must not disclose family contents to the developer.
- Secrets remain protected in Cloudflare, not in public GitHub files.
- Location sharing is optional and requires active consent.
- Parents/admins manage their family's access and backups.

Cloud hosting is not a guarantee of absolute privacy. Protect the relevant accounts, minimize privileges and maintain recoverable backups.

## What do we need to begin?

You will eventually need an adult responsible for a Cloudflare account, an internet domain and family configuration. You do **not** need Google Calendar for the portal's own features.

Next:

1. [Preparation checklist](prerequisites-en.md)
2. [Planned installation walkthrough](installation-en.md)
3. [Public GitHub Releases](https://github.com/valfrid/nerenportal-releases/releases)

**Please do not copy the private development pilot, its database or its deployment configuration as an installer.** Wait for a reviewed, family-neutral public release.
