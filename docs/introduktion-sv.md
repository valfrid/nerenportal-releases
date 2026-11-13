# Välkommen till Familjeportalen

**Ett gemensamt ställe för familjens vardag – på mobilen och hemma.**

Familjeportalen är en privat webbapp som hjälper vuxna och barn att ha koll på vad som händer. Samma portal fungerar både på familjens gemensamma skärm och på var och ens telefon. Den är utformad så att varje familj får en **egen installation och äger sina egna uppgifter**.

> **Projektstatus:** Den generiska portalen testas fortfarande. Någon installerbar, signerad offentlig version har ännu inte släppts. Den här guiden beskriver vad portalen är tänkt att erbjuda och vad som behöver förberedas, inte en färdig installationstjänst.

## Vad kan familjen göra?

| Område | Exempel |
| --- | --- |
| **Idag och kalender** | Se vem som har en aktivitet, när den börjar och vad som händer i veckan. Google Kalender kan anslutas separat. |
| **Uppgifter** | Återkommande sysslor, personliga uppgifter och extra uppdrag. |
| **Veckopeng** | Följ barnens pengar, sparande och eventuella uppgiftsregler. |
| **Mat och inköp** | Planera lunch och middag, samla recept och fylla på familjens inköpslistor. |
| **Meddelanden** | Skicka korta meddelanden inom familjen. |
| **Önskelistor** | Samla presentönskningar. En separat gästvy kan göra det möjligt att reservera presenter utan att avslöja överraskningen för barnet. |
| **Kiosk** | En liten familjebutik med egna produkter och priser. |
| **Var är alla?** | Visa kommande aktiviteter och frivillig, tidsbegränsad positionsdelning. |

De vuxna har administrationsfunktioner som barn inte ser. Funktioner och behörigheter behöver konfigureras av varje familj. **AI-assistent, Google-koppling, platsdelning och externa integrationer är valfria**; tillgång och driftskostnad kan bero på vilka tjänster som ansluts.

## Så används portalen

**På mobilen:** Varje familjemedlem kan ha sin egen personliga ingång och se det som hör till henne eller honom. Portalen är en *PWA*: en webbapp som går att lägga på startskärmen utan en traditionell appbutik.

**På en gemensam skärm:** En hallskärm eller surfplatta kan visa familjens översikt, veckans händelser, mat, listor och uppgifter. Enheten ska registreras med rätt behörighet.

**För de vuxna:** En skyddad administrationssida används för att lägga till personer, hantera inställningar, koppla kalendrar och registrera nya enheter. Inloggning använder telefonens eller datorns passkey-system.

## Vem äger informationen?

Familjens egna data lagras i **familjens Cloudflare-konto**, i en D1-databas och vid behov R2-lagring för bilder. Google Kalender, om man väljer det, ligger kvar hos det Google-konto som äger kalendrarna.

- Familjerna delar inte databas med varandra.
- Programuppdateringar ska inte kräva att utvecklaren får läsa familjens vardagsdata.
- Känsliga nycklar sparas som skyddade secrets, inte i publika GitHub-filer.
- Positionsdelning är frivillig och kräver ett aktivt val.
- Föräldrar ansvarar för familjens egna användarbehörigheter, säkerhetskopior och anslutna tjänster.

Ingen molntjänst kan garantera absolut sekretess. Använd starka kontoskydd, begränsade behörigheter och regelbundna säkerhetskopior.

## Måste man vara teknisk?

Målet är att installationen ska vara begriplig utan programmeringskunskaper. Däremot behöver någon vuxen kunna administrera familjens Cloudflare-konto och domän – åtminstone under första installationen.

Du behöver **inte** ansluta ett Google-konto för att använda portalens egna listor, uppgifter och andra funktioner. Google Kalender är ett separat, frivilligt steg.

Läs vidare:

1. [Vad behöver vi förbereda?](forberedelser-sv.md)
2. [Installationsguiden – planerat flöde](installationsguide-sv.md)
3. [Offentliga releaser](https://github.com/valfrid/nerenportal-releases/releases)

**Viktigt:** Installera inte genom att kopiera den privata pilotens kod, databaser eller Cloudflare-inställningar. Vänta på en publicerad och verifierad familjeneutral release.
