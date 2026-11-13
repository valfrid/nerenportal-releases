# Säkerhetsnycklar och hemligheter – vem skapar dem och var sparas de?

[← Förberedelser](forberedelser-sv.md) · [Installationsguide](installationsguide-sv.md)

> **Status:** Detta är specifikationen för den planerade installationsguiden, **inte** en beskrivning av en redan färdig Wizard. Detaljer och eventuella variabelnamn kan förändras innan den första signerade releasen. Nedan anges namn som används i den nuvarande portalens kod, när det är relevant.

## Grundregel

Familjen äger sitt Cloudflare-konto och sina data. Installatören ska generera **unika, kryptografiskt slumpmässiga** hemligheter för varje familj, lägga dem direkt i rätt Cloudflare Worker **Secret** (aldrig i vanlig Text/Vars), och hålla hemliga värden borta från frontend, loggar och GitHub. En installations-/deploymenttoken ska vara så kortlivad och begränsad som möjligt.

Cloudflare döljer ett Secret-värde i sitt användargränssnitt efter att det sparats. Familjen ska därför få hjälp att skapa ett **lokalt, krypterat återställningspaket** för just de nycklar som verkligen behövs vid katastrofåterställning. Det krypterade paketet och dess lösenfras ska inte lagras på samma ställe. Ingen central utvecklarkopia av familjens hemligheter.

## Inventering – faktiskt kodnamn och planerad Wizard-hantering

| Parameter / resurs | Vem skapar? | Var den lagras i drift | Behåll för senare? |
| --- | --- | --- | --- |
| Cloudflare-konto och `CLOUDFLARE_ACCOUNT_ID` | Familjen skapar konto; Wizard upptäcker ID efter behörigt godkännande | I installationsmetadata. **Account ID är inte ett lösenord** | Spara kontots ägarinformation och återställningsmetod |
| Tillfällig Cloudflare-installationstoken | Familjen godkänner begränsade behörigheter; Wizard använder tillfälligt | Endast säker installationssession, **inte vanlig portal** | **Återkalla efter verifierad installation**; ingen långvarig backup |
| Worker, D1 och R2 | Wizard skapar resurser under familjens konto | Cloudflare-bindings/inställningar, inte secrets | Exportera resursnamn/ID och backup-plan, men inga innehållsdata i publika filer |
| `BOOTSTRAP_SECRET` | Wizard genererar slumpmässig engångskod | Cloudflare Secret, enbart under säker initial registrering eller kontrollerad återställning | **Avaktivera/radera** efter första passkey-registrering om återställningsflödet tillåter; gör ny kod vid recovery, återanvänd inte gammal |
| Passkeys/WebAuthn | Telefon/dator genererar privat nyckel | Privat del på användarens enhet; publika credential-data i D1 | Registrera **minst två** betrodda vuxenenheter när möjligt; ingen export av privat passkey till Wizard |
| `GOOGLE_CLIENT_ID` | Google Cloud OAuth-klient | Cloudflare Worker-konfiguration; ID är vanligtvis inte hemligt | Spara projekt- och klientidentifierare |
| `GOOGLE_CLIENT_SECRET` | Google Cloud OAuth-klient | Cloudflare Worker Secret | Spara i krypterat återställningspaket eller lösenordshanterare |
| `GOOGLE_TOKEN_ENCRYPTION_KEY` | Wizard genererar unik krypteringsnyckel per installation | Cloudflare Worker Secret | **Kritiskt:** säkerhetskopiera krypterat. Om nyckeln byts utan migrering kan sparade OAuth-token inte längre dekrypteras; omanslutning till Google kan krävas |
| `RECIPE_MCP_TOKEN`, `CALENDAR_MCP_TOKEN` | Wizard genererar bara när dessa integrationer aktiveras | Cloudflare Worker Secrets; klienten får en tilldelad token via säker inmatning | Spara säkert där klienten ska anslutas; rotera och konfigurera om anslutna klienter vid behov |
| `WISH_GUEST_CODE` | En vuxen eller Wizard väljer unik kod om gästönskelista används | Cloudflare Worker Secret | Håll privat och möjliggör byte utan att förstöra önskelistor |
| Backupkrypteringsnyckel (om en sådan införs) | Wizard genererar och förklarar | Skyddad familjeägd backup-/Secret-lagring | **Kritiskt:** utan nyckeln kan krypterad backup vara oåterställbar |
| Framtida updater-deploytoken | Familjen ger *separat* minsta möjliga deploybehörighet | En särskild uppgraderingstjänsts Secret, **inte i vanliga portal-Workern** | Dokumentera hur den återkallas, roteras och återskapas; spara inte i GitHub |
| Domän, tidszon, personnamn, release-version | Familjen väljer; Wizard validerar | Vanlig portal-/D1-konfiguration | Spara i installationsrapport; **inte** hemligheter |

**Observera:** `CLOUDFLARE_API_TOKEN`, `STAGING_CLOUDFLARE_API_TOKEN` och andra GitHub Actions-/staging-nycklar som finns i utvecklingsrepot är **inte** secrets som familjer ska kopiera från pilotinstallationen. Guiden ska bara använda avgränsade behörigheter för familjens egna resurser.

## Så ska användaren uppleva säkerhetssteget

Varje säkerhetsparameter får ett kort med:

1. **Vad används värdet till?** T.ex. ”Skyddar anslutningen till Google Kalender”.
2. **Vem skapar värdet?** ”Genereras automatiskt” eller ”Hämta hos Google/Cloudflare”.
3. **Vart sparas det?** Exakt Worker/Secret eller separat updater-tjänst.
4. **Vad händer om det försvinner?** ”Kan skapas om” / ”Google måste anslutas igen” / ”Kan hindra backupåterställning”.
5. **Status:** *Inte skapat → Skapat → Installerat → Verifierat → Säkerhetskopierat där det behövs*.

Slutanvändaren ska **inte** kopiera 64 slumptecken till tio olika fält. Wizard ska generera med säker slumptalsgenerator och skriva värdet till Cloudflare via godkänd, begränsad kanal. Ett hemligt värde som behöver arkiveras erbjuds som **lokalt krypterad export**; lösenfrasen visas aldrig för den centrala installatören. Token och hemligheter ska inte skrivas i vanliga driftloggar.

### Återställningspaket

Ett krypterat paket bör innehålla: installations-ID, Cloudflare-resurs-ID, release-version, domän, valda integrationer, Google OAuth-klientinformation och de **långlivade återställningsnycklar** som uttryckligen behöver kunna återskapas. Avsiktligt **inte**: temporära installationstoken, session-cookies, privata WebAuthn-nycklar eller familjens D1/R2-innehåll (det hör till separat databasbackup).

Spara det krypterade paketet i minst två pålitliga utrymmen och nyckeln/lösenfrasen separat. Testa återställning till en isolerad testmiljö innan något händer på riktigt.

## Efter installationen – Säkerhetscenter

I portalens Admin bör det finnas **Säkerhet och återställning** som kan visa status utan att någonsin återge hemliga värden: Cloudflare-resurser anslutna, passkeys registrerade, Google integrerat, MCP-token konfigurerad, senaste säkerhetskopian, senaste testade återställning, updaterns behörighet och rotationsdatum.

Rotation ska kräva en ny vuxenbekräftelse och ge en konsekvensvarning. Exempel: att byta `GOOGLE_TOKEN_ENCRYPTION_KEY` utan att dekryptera/återkryptera befintliga token gör att Google måste anslutas igen.

## Nästa implementeringskrav

- Automatisk generering och installation av secrets (aldrig användarens valda standardlösenord).
- Behörighetsgranskning för Cloudflare; separata *installations-* och *uppgraderingstoken*.
- **Olika nycklar för olika installationer** och separata pilot-/testvärden.
- Kontrollerad, lokalt krypterad återställningsfil + integritetstest, utan central kopia.
- Passkey-återställning med andra registrerade vuxenenheter.
- Tester att secrets inte läcker till Github, HTML, API, loggar eller D1-vanliga inställningar.

**Detta blir ett obligatoriskt delsteg i den riktiga installations-Wizarden, inte en frivillig felsökningsbilaga.**
