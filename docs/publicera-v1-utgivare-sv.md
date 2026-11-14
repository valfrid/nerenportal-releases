# Publicera Familjeportal v1.0.0 – utgivaren (inte familjerna)

Detta är en **engångskonfiguration för portalens utgivare**. Familjer som installerar via `install.neren.cc` ska aldrig behöva GitHub-konto, en API-token, en signeringsnyckel eller CLI.

## Vad är redan förberett?

- Granskad, separat, familjeneutral releasekandidat i det **privata utvecklingsrepot**: `release/v1.0.0-candidate`, commit `11df28d7906c5c4619076334a9e7e1789cf900e6`.
- Verifierade automatiska tester och ett offlinebyggt, **osignerat** Worker/Assets-paket med granskade D1-migrationer.
- Distributionsrepots manuella arbetsflöde: [Publish signed generic Family Portal v1.0.0](https://github.com/valfrid/nerenportal-releases/actions/workflows/publish-family-portal-v1.yml).
- GitHub Releases-skapandet använder **endast distributionsrepot**, inte Neréns produktions-Worker, D1 eller R2. Ingen Cloudflare-deploy sker under publiceringen.

## En gång, av utgivaren

1. **Skapa och säkerhetskopiera en Ed25519-utgivarnyckel** i en lokal, skyddad miljö. I en lokal checkout av den privata källkoden, kör:
   ```shell
   node scripts/releases/create-signing-key.mjs --generate /saker/plats/family-portal-publisher.pem
   ```
   Den privata PEM-filen ska hållas privat och säkerhetskopieras krypterat. Programmet visar bara den offentliga nyckeln i 64 hextecken. Skapa inte en ny nyckel för varje version.
2. I `valfrid/nerenportal-releases`, öppna **Settings → Secrets and variables → Actions**. Lägg till följande två **repository secrets**:
   - `RELEASE_SIGNING_PRIVATE_KEY_PEM`: innehållet i din privata Ed25519 PEM, endast för utgivarens manuella release-jobb.
   - `PORTAL_SOURCE_READ_TOKEN`: en utgivarägd, kortlivad, *fine-grained* GitHub-token med **Contents: Read** begränsad till privata `valfrid/nerenportal`. Den får inte ha Cloudflare-behörigheter.
3. Lägg under **Variables** till `RELEASE_SIGNING_PUBLIC_KEY`: 64 små hextecken från steg 1. Denna är **inte hemlig**. Samma publika värde måste senare pinnas i Installer Workern och i familjeportalens uppdaterare; lita aldrig på en publik nyckel som levereras från samma release som ska verifieras.
4. Konfigurera gärna **Settings → Environments → family-portal-release-publisher** med obligatoriskt godkännande från utgivaren. Jobbet använder denna miljö som extra spärr.
5. Kontrollera en gång till att v1.0.0-paketet är avsett att kunna hämtas offentligt. Det ska inte innehålla någon personlig Nerén-data eller någon privat hemlighet.

## Publicera v1.0.0

Öppna [release-jobbet i GitHub Actions](https://github.com/valfrid/nerenportal-releases/actions/workflows/publish-family-portal-v1.yml). Välj **Run workflow**, branchen `main` och skriv exakt `PUBLISH-SIGNED-FAMILY-V1`.

Arbetsflödet kommer då att:

1. Vägra publicering om v1.0.0-taggen/releasen redan finns.
2. Hämta **exakt** fruset commit från det privata repot med en läsbegränsad token.
3. Bygga Worker/Assets + granskade D1-migrationer och köra tester, utan Cloudflare-token.
4. Kontrollera att inga pilotdatamigrationer eller privata filer följer med.
5. Jämföra Ed25519-nyckelns publika del mot den **förväntade** publika nyckeln.
6. Signera exakt release-manifest och kontrollera två SHA-256-hashar.
7. Skapa ett **utkast** till GitHub Release i det publika repot med fem filer:
   `portal-worker-package.tar.gz`, `schema-migrations.tar.gz`, `release-manifest.json`, `release-manifest.sig` och `build-dependencies.lock.json`. Den sistnämnda är den faktiska npm-låsfil som skapades under releasebygget; dess SHA-256 är med i det signerade manifestets noteringar. Detta är byggspårbarhet utöver signaturen på själva installationsfilerna.
8. Publicera utkastet **endast efter** kontroll att exakt de fem filerna har laddats upp.

Misslyckas något steg ska releasen inte publiceras. Om ett fel inträffar efter skapande av utkastet stannar utkastet opublicerat för granskning; v1.0.0-taggen ska då inte återanvändas okontrollerat.

## Viktiga avgränsningar

**En signerad release är inte en installerad portal.** Wizarden har fortfarande `installationEnabled:false` och kräver separat Cloudflare write OAuth och installationsmotor innan vi kan skapa den fiktiva testfamiljens Worker/D1/EU-R2.

Ingen familj ska behöva lägga till GitHub Secrets. Utgivarens två publisher-secrets är en separat releaseprocess och delas inte med installerade familjer.
