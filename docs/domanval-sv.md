# Välj domän till Familjeportalen

[← Förberedelser](forberedelser-sv.md) · [Installation](installationsguide-sv.md)

## Vårt förstahandsval: en .cc-domän hos Cloudflare

För en familj som **inte redan har en domän** rekommenderar vi en kort adress med **`.cc`** och registrering hos **Cloudflare Registrar**.

- **Kort och lätt att minnas:** Exempelvis `familj-namn.cc` (endast ett exempel; vi har inte undersökt om namnet är ledigt).
- **Smidig konfiguration:** Cloudflare Registrar använder automatiskt Cloudflares namnservrar, så ett separat DNS-byte hos en annan registrar behövs inte.
- **Samma leverantör:** Domän, DNS, Worker, D1 och R2 hanteras från familjens Cloudflare-konto.
- **Tillgänglighet och pris:** Kontrollera alltid i Cloudflares registreringsflöde, inklusive **förnyelsepris**, innan köp. Namn kan vara upptagna eller ha premiumpris.

Cloudflare har uttryckligt stöd för att registrera `.cc` via sin **webbpanel**, men **`.cc` stöds för närvarande inte av Cloudflare Registrar API för automatiska köp**. Den kommande Wizard-guiden ska därför **visa vägen till manuell registrering**, inte försöka köpa domänen själv.

[Registrera domän via Cloudflare](https://dash.cloudflare.com/) · [Cloudflares .cc-information](https://www.cloudflare.com/application-services/products/registrar/buy-cc-domains/)

## Alternativ: använd er befintliga domän

Om ni redan äger `familj.se` eller en annan adress behöver ni **inte** köpa en ny `.cc`-domän.

Cloudflare **DNS** fungerar även för domäner registrerade hos andra leverantörer. Lägg till er domän i Cloudflare och ändra normalt namnservrarna hos den registrar som idag förvaltar den. Ni kan fortsätta betala domänförnyelsen där.

Var noga med befintlig e-post innan ni ändrar DNS: behåll nödvändiga **MX-, SPF-, DKIM- och DMARC-poster**, annars kan familjens e-post påverkas. En domän som används för e-post eller andra webbplatser kräver särskilt noggrann DNS-kontroll.

## Alternativ: annan registrar

Man kan köpa exempelvis en `.se`-domän hos en registrar som erbjuder den, sedan konfigurera Cloudflare som DNS-leverantör. Det innebär ett extra steg men fungerar med portalens arkitektur.

Det är viktigt att skilja mellan:

- **Cloudflare Registrar:** Var du **köper och förnyar domänen**. Den stöder många, men inte alla, nationella toppdomäner.
- **Cloudflare DNS:** Var DNS-poster och namnservrar **hanteras**. Detta kan användas även när domänen registrerats någon annanstans.
- **Cloudflare Workers:** Där själva Familjeportalen körs.

## Så ska installations-Wizarden hjälpa

1. Fråga om ni redan har en domän.
2. Om **nej**: föreslå `.cc` via Cloudflare Registrar som standard.
3. Visa ett par namnförslag, **utan att hävda att de är lediga**. Verklig tillgänglighet och pris måste kontrolleras av registratorn.
4. Öppna Cloudflares registreringssida för en manuell transaktion. **Köp är aldrig automatiskt och kräver familjens eget godkännande och betalning.**
5. När domänen är registrerad: hjälp att verifiera att den finns i **rätt Cloudflare-konto**, att den är aktiv och att DNS kan användas.
6. Om **ja**: använd befintlig domän och vägled vid behov hur Cloudflares namnservrar aktiveras hos befintlig registrar.

**Observera:** Cloudflare Registrar kräver att domänen använder Cloudflares namnservrar. Om man senare vill lämna Cloudflare DNS måste domänen först flyttas till en annan registrar.

### Varför säger vi inte att .cc är ”nya .com”?

`.cc` är kort och passar vårt projekt bra, men ”nya `.com`” är ett marknadsföringsuttryck, inte en verifierad branschstandard. En familj ska kunna välja den domän som passar dem utan att känna sig tvingad.

**Officiella källor:** [Cloudflare Registrar .cc](https://www.cloudflare.com/application-services/products/registrar/buy-cc-domains/), [Cloudflare Registrar API](https://developers.cloudflare.com/api/resources/registrar/), [Cloudflare DNS och namnservrar](https://developers.cloudflare.com/dns/nameservers/update-nameservers/).
