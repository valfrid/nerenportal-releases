# Installera Familjeportalen – planerat steg-för-steg-flöde

[← Förberedelser](forberedelser-sv.md) · [Introduktion](introduktion-sv.md)

> **Inte tillgängligt ännu:** Detta beskriver **hur den kommande stabila installationen ska fungera**. Ingen signerad, färdigtestad publik release eller generell bootstrap-updater har publicerats. Kör inte pilotens privata migrations-, staging- eller deploy-skript i ett nytt familjekonto. Tekniska instruktioner blir konkreta och versionslåsta när första release är godkänd.

## Översikt

```text
1. Läs förberedelserna
         ↓
2. Välj signerad GitHub Release
         ↓
3. Anslut familjens Cloudflare-konto och domän
         ↓
4. Skapa isolerad Worker, D1 och R2
         ↓
5. Registrera första förälderns enhet med passkey
         ↓
6. Lägg till familjemedlemmar och valfria integrationer
         ↓
7. Testa, säkerhetskopiera och aktivera uppdateringskontroll
```

En installatör ska kunna göra detta utan att klona det privata utvecklingsrepot. Installationskomponenten behöver tillfällig, avgränsad Cloudflare-behörighet och ska aldrig visa sina deploy-nycklar i webbläsaren.

## Steg 1 – förbered domän och konton

Skapa eller välj ert eget Cloudflare-konto och aktivera stark inloggning. Kontrollera att ni förfogar över en domän och kan uppdatera dess DNS-inställningar. Domänregistratorn behöver **inte** vara Cloudflare.

Bestäm familjens huvuddomän och de önskade ingångarna, till exempel `admin.familj.example`, `hall.familj.example` och personliga underdomäner. De måste peka på **er** installation, inte på ett pilotkonto.

Använd [förberedelsebladet](forberedelser-sv.md) för namn och roller. Ange aldrig kontolösenord eller secrets där.

## Steg 2 – välj rätt programversion

Öppna [GitHub Releases](https://github.com/valfrid/nerenportal-releases/releases).

- Välj en uttryckligen publicerad **stabil** version, inte `main`, `latest.zip` eller en prerelease.
- Läs vilka Worker-bindings och D1-migreringar som ingår och om versionen stöder en nyinstallation.
- Installationsprogrammet ska kontrollera manifestets signatur med en betrodd nyckel samt paketens SHA-256 **innan** något exekveras.
- Om inga stabila signerade releaser finns: **avbryt här**. Bygg inte en egen installation utifrån pilotens källkod.

## Steg 3 – skapa familjens isolerade resurser

Den planerade installatören skapar eller verifierar separata resurser i ert Cloudflare-konto: en Worker med statiska PWA-filer, en D1-databas, R2 för bilder och nödvändiga miljöbindings. Installationsguiden ska visa exakt vilka resurser som skapas och vilka behörigheter som används.

**Ingen databas kopieras från en annan familj.** Historiska pilotmigreringar som innehåller namn, e-postadresser eller engångsåterställningar får inte följa med en nyinstallation. Endast granskade, generella schemamigreringar körs.

Registrera en unik installationsidentitet som uppdateraren senare kan verifiera. Säkerställ att eventuella prenumerations-/kostnadsinställningar är kända innan installationen fortsätter.

## Steg 4 – skydda första inloggningen

Installationen ska ha en **kortlivad och begränsad bootstrap-process** för den första vuxna administratören. Använd en engångshemlighet som förvaras säkert, och registrera första telefonen/datorn med passkey (fingeravtryck, PIN eller enhetens säkerhetssystem).

- Välj första vuxnas riktiga visningsnamn. Portalen ska inte levereras med någon förvald persons namn.
- Kontrollera att endast en registrerad vuxenenhet kan öppna Admin.
- Lägg till en andra vuxen/admin-enhet som återställningsmöjlighet, om familjen har en.
- Inaktivera eller återkalla engångsbootstrap när installationen är verifierad. Lämna inte kvar en öppen registreringssida som ger administratörsbehörighet.

## Steg 5 – skapa familjens innehåll

I Admin lägger ni till vuxna, barn, familje-/personliga vyer, uppgiftstyper, eventuella veckopengsregler och familjelistor. Börja gärna med en enda testuppgift och en inköpslista innan allt konfigureras.

Testa behörigheter med en **registrerad barnenhet**: barnet ska se sina egna åtgärder, inte de vuxnas hemliga inställningar eller gästernas presentreservationer.

## Steg 6 – anslut frivilliga tjänster

**Google Kalender:** Om ni vill ansluta kalendern skapar ni/återanvänder ett Google Cloud-projekt och väljer en OAuth-klient av typen *Web application*. Exakt redirect-URI visas av **er** portal under Admin → Integrationer. Aktivera bara önskade Google-behörigheter, och spara OAuth-hemligheter i Cloudflare Secrets. Portalen ska användas utan Google om ni väljer att avstå.

**AI:** Aktiveras först när Worker-AI-binding, gränser och eventuella kostnader är kända och testade.

**GPS:** En person väljer själv att dela sin plats; anslutningen ska aldrig starta automatiskt för barn eller vuxna. Ange hemposition bara om avstånd till hemmet ska användas.

**Hallskärm:** Registrera den som egen enhet och ge enbart den behörighet som behövs.

## Steg 7 – slutkontroll före vardagsanvändning

- [ ] Portalens startsida och en personlig ingång fungerar via HTTPS.
- [ ] Oregistrerad webbläsare får inte se skyddade sidor eller privata API-data.
- [ ] Passkey fungerar på registrerad enhet; barn kommer inte åt Admin.
- [ ] En uppgift, en lista och vid behov veckopeng kan skapas och läsas tillbaka.
- [ ] Bild (avatar/recept/kiosk) går att ladda upp och öppna via familjens R2.
- [ ] Valfri Google-anslutning visar rätt kalendrar och behörigheter.
- [ ] Backup är **skapad och återläsning är provad** i en isolerad miljö.
- [ ] Admin visar installerad version och en korrekt, läsbar uppdateringsstatus.
- [ ] Inga deploy-token finns i portalens vanliga frontend eller lokala lagring.

## Uppdateringar och återställning

Familjens Worker ska kontrollera offentliga GitHub-releaser ungefär en gång per dygn. En ny release **installeras inte av sig själv**: en vuxen granskar ändringarna och godkänner den via en separat säker uppgraderingstjänst. Den tjänsten kontrollerar signatur, kompatibilitet, backup och eventuella D1-migreringar.

**Observera:** Att rulla tillbaka Worker-koden återställer inte automatiskt D1 och R2. Vid misslyckad uppgradering ska familjen få en begriplig status och kunna följa en dokumenterad återställningsplan.

## Om något inte fungerar

| Symtom | Vad du bör kontrollera |
| --- | --- |
| Inloggning misslyckas | Öppna rätt domän och använd den passkey som registrerades för just den domänen. |
| Fel på `/admin` | Kontrollera att du är inloggad som förälder/admin och inte i en oregistrerad webbläsare. |
| Ingen kalender | Google är frivilligt. Kontrollera OAuth-status, Calendar API, redirect-URI och kalender-ID:n. |
| Bilder saknas | Kontrollera att Worker har rätt R2-binding och att objektet finns i familjens bucket. |
| Ingen ny version visas | Kontrollera att en stabil GitHub Release faktiskt är publicerad och att senaste kontrollen lyckades. |
| Installation blir avbruten | Återanvänd inte på måfå gamla secrets. Använd installatörens dokumenterade återupptagning eller återställning. |

**Nästa statussteg:** När första stabila release och den fristående installatören finns uppdateras denna sida med verifierade klick-för-klick-instruktioner och exakta skärmbilder. Inga installerarkommandon publiceras före det.
