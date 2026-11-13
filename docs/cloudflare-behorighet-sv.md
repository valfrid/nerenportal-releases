# Hur får installations-Wizarden åtkomst till en familjs Cloudflare-konto?

[← Domänval](domanval-sv.md) · [← Säkerhetsnycklar](sakerhet-och-nycklar-sv.md)

> **Status 13 november 2026:** En teknisk prototyp av en separat workers.dev-installatör finns i det privata utvecklingsrepot. Den publika GitHub Pages-Wizarden är fortfarande **demo**; ingen verklig Cloudflare-anslutning eller OAuth-inloggning sker ännu.

## GitHub Releases har inte rätt att installera hos familjerna

`valfrid/nerenportal-releases` är ett **publikt distributionsbibliotek** med guider och framtida signerade utgåvor. Releaserna ska kunna hämtas och verifieras utan GitHub-inloggning. **Repot har ingen generell Cloudflare-token**, och dess GitHub Pages-webbsida kan inte i sig skapa Worker, D1, R2 eller DNS hos en annan familj.

Ett GitHub Actions-secret lagras för det **GitHub-repo där workflowet körs**. Ett sådant secret i utvecklarens repo ger inte automatiskt rätt till andra personers Cloudflare-konton. Varje familj behöver ge **egen, uttrycklig, begränsad behörighet**.

## Rekommendation: Cloudflares publika OAuth-klient

Cloudflare introducerade **self-managed OAuth clients den 3 juni 2026**. Vi kan registrera en **Family Portal Installer** som en OAuth-applikation hos Cloudflare. När den är godkänd för **public** synlighet kan personer från andra Cloudflare-konton själva välja sitt konto och godkänna vilka rättigheter installatören får.

Flödet för den färdiga produkten:

1. En familj väljer först domän och registrator i wizarden.
2. En vuxen väljer **Anslut Cloudflare** och skickas till Cloudflares officiella inloggning/medgivandeskärm.
3. Cloudflare visar vilken app som vill ha åtkomst, vilket konto som valts och exakt vilka rättigheter som begärs.
4. Familjen godkänner. Via **Authorization Code + PKCE** (eller en säker server-side code-flow) kommer en kortlivad auktorisering till en **separat installationsbackend**.
5. Installationsbackend verifierar begäran och installerar **bara i det konto som familjen godkände**. Den kontrollerar att resursnamn inte kolliderar, verifierar signerad release och säkerhetskopierar/rapporterar installationen.
6. Installatörens åtkomst avslutas eller återkallas efter installationen. Framtida uppgraderingar har en **egen** plan för begränsad behörighet.

**Viktigt:** Cloudflare kräver att vår publika OAuth-app har en **verifierad utgivardomän**. Verifieringen görs genom en särskild DNS TXT-post. En egen `install.neren.cc`-adress med domän som vi kontrollerar är därför lämplig, även om själva frontend-filerna fortfarande levereras från GitHub Pages. Cloudflare kan inte ge oss rätt att göra ändringar hos en godtycklig kund utan att kunden godkänner det.

Det behövs också en **server-/backend-del** som hanterar installationssessioner, engångsbehörigheter, säkerhetsnycklar, kvittenser och felhantering. Ett publikt HTML-dokument ska aldrig innehålla klienthemlighet, långlivad installationsnyckel eller kontots tokens.

### Behörigheter – inte mer än nödvändigt

De exakta scopesen måste verifieras per Cloudflare-API och installationssteg. Som utgångspunkt behöver vi tillstånd för att skapa/hantera en ny Worker och D1/R2, samt **endast om familjen har en domän** rätt att konfigurera det aktuella DNS-området/Worker-rutter. Första installationen behöver ibland en bredare *produktnivå* för att skapa nya resurser, men den rättigheten ska inte ges till den vanliga portalen eller en permanent allmänt använd token. Cloudflares detaljerade Workers-behörigheter skiljer mellan att skapa en ny Worker och att ändra en befintlig.

Domänköp är ett separat godkännande. `.cc` finns via Cloudflare Registrar i webbpanelen, men stöds inte för automatiskt köp via Registrar-API:t i nuläget.

## Reservväg: en API-token som familjen skapar själv

Om OAuth inte är klart kan en vuxen skapa en **tillfällig account- eller user API-token** direkt i Cloudflare, begränsa den till det aktuella kontot och rättigheterna och lämna den till en **betrodd installationsbackend**, aldrig till GitHub Pages, ett publikrepo, en issue eller ett vanlig webbfält utan skydd.

Efter verifierad installation återkallas token. Separat, begränsad behörighet behövs för framtida uppdateringar. **Global API Key ska inte användas.**

Det är inte en lösning att samla familjernas tokens i utvecklarens GitHub Actions Secrets: det skapar onödigt centraliserad, permanent åtkomst.

## Säkra användarval i wizarden

- **Domän först:** köp `.cc` manuellt i Cloudflare, behåll befintlig domän eller testa med `workers.dev`. Sidfliken och konfigurationen ska finnas kvar när familjen återvänder.
- **Egna lösenfraser när det är lämpligt:** låt vuxna välja en lång `BOOTSTRAP_SECRET`-kod, en egen `WISH_GUEST_CODE` och lösenfras för en krypterad återställningsfil, med styrkekontroll i den riktiga installatören.
- **Automatiska nycklar när det behövs:** `GOOGLE_TOKEN_ENCRYPTION_KEY`, kryptografiska signeringsnycklar och åtkomsttoken ska genereras starkt och slumpmässigt. Vanliga minnesvänliga lösenord är olämpliga här.
- **Ingen hemlighet i demot:** nuvarande GitHub Pages-wizard visar bara val av *metod* och genererar/lagrar inga hemliga värden.
- **Återställning:** lämna en lokalt krypterad återställningsfil; förlora inte nycklarna till lagrade OAuth-token och säkerhetskopior.

## Officiella Cloudflare-källor

- [Introducing self-managed OAuth clients (3 juni 2026)](https://developers.cloudflare.com/changelog/post/2026-06-03-public-oauth-clients/)
- [Create your OAuth client, PKCE, verified client domain](https://developers.cloudflare.com/fundamentals/oauth/create-an-oauth-client/)
- [Authorizing an application and account selection](https://developers.cloudflare.com/fundamentals/oauth/authorizing-an-application/)
- [Developer Platform roles and permissions](https://developers.cloudflare.com/workers/authorization/)
- [Registrar API, inklusive undantag för .cc](https://developers.cloudflare.com/api/resources/registrar/)
