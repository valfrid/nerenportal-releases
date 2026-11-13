# Innan ni installerar Familjeportalen

**Checklista för familjen** · Läs först [introduktionen](introduktion-sv.md).

> **Obs!** Det finns ännu ingen stabil installera-knapp eller signerad `v1.0.0`-release. Ni kan förbereda er, men följ inte pilotens staging-/deploy-skript som installationsanvisningar.

## 1. Det som behövs

- [ ] **En vuxen som tar ansvar för installationen.** Personen blir initial administratör, hanterar nya enheter, backup och eventuella tekniska fel.
- [ ] **Ett eget Cloudflare-konto**, skyddat med tvåfaktorsautentisering. Familjen äger sina Workers, D1 och R2 i detta konto. Ingen utvecklares konto behöver åtkomst till familjens innehåll.
- [ ] **En egen domän**, t.ex. `familj.example`, som ni kontrollerar. **Rekommendation:** välj en kort `.cc` och registrera via Cloudflare för enklare DNS-konfiguration. Har ni redan en `.se` eller annan domän går den också bra med Cloudflare DNS. Läs [Domänval och Cloudflare Registrar](domanval-sv.md).
- [ ] **En modern telefon eller dator med passkey-stöd** (t.ex. plattformens inbyggda passkey-system). Den första vuxna enheten registreras säkert under installationen.
- [ ] **Ett familjenamn och en lista över medlemmarna.** Börja med föräldrar/vårdnadshavare och de barn som ska ha varsin vy. Ni bestämmer personnamn, eventuella personliga ingångar och färger.
- [ ] **Ett ställe att spara återställningsinformation**, till exempel en lösenordshanterare. Här sparas kontoåterställning och installationsnycklar – aldrig i publika dokument eller meddelanden.

## 2. Välj vad som ska anslutas

| Val | Behövs första dagen? | Att tänka på |
| --- | --- | --- |
| **Google Kalender** | Nej | Om ni vill använda det: Google-konto med tillgång till önskade kalendrar och ett Google Cloud-projekt med OAuth-klient/Calendar API. Exakta redirect-URI:er bestäms efter domänvalet. |
| **Gemensam hallskärm** | Nej | Surfplatta, minidator eller annan skärm med uppdaterad webbläsare. Enheten måste registreras. |
| **AI-assistent** | Nej | Kräver verifierad AI-binding/konfiguration och att ni godkänner tillämpliga användningsvillkor och kvoter. |
| **Positionsdelning** | Nej | GPS-behörighet ges av personen själv. Hemposition behövs om avstånd hemifrån ska beräknas. |
| **E-post/MCP/andra tjänster** | Nej | Separata integrationer med egna behörigheter, domäninställningar och eventuell kostnad. |

Google-kontot behöver inte vara samma konto som Cloudflare-kontot. Ni bör inte dela ett enda Google-lösenord mellan alla familjemedlemmar.

## 3. Bestäm era adresser

Exempel (påhittade värden – använd era egna):

| Adress | Avsikt |
| --- | --- |
| `familj.example` | Familjens portal |
| `admin.familj.example` | Skyddad administration |
| `hall.familj.example` | Gemensam skärm |
| `anna.familj.example` | En persons ingång |
| `onskningar.familj.example` | Valfri gästvy för önskelistor |

Subdomäner är *ingångar*, inte inloggning. Även om någon känner till en adress får personen inte tillgång till skyddade data utan behörig registrerad enhet/session. Välj adresser tidigt: passkeys och Google OAuth är knutna till exakta domäner/origins och kan kräva ny konfiguration vid senare byte.

## 4. Säkerhet, kostnad och ansvar

- **Cloudflare kan ha kostnader eller användningsgränser**, särskilt för Workers, D1, R2 och AI. Läs aktuella villkor i ert eget konto. Dokumentationen lovar ingen specifik gratiskvot.
- **Google-tjänster har egna villkor** och Google Cloud kan kräva konto-/betalningsinställningar beroende på tjänst.
- **Backup behövs.** En Worker-rollback återställer inte automatiskt D1-data eller R2-bilder. Bestäm vem som sparar återställningsuppgifter och hur backup ska prövas.
- **Secrets är hemliga.** Lägg aldrig API-token, OAuth-klienthemligheter, krypteringsnycklar eller bootstrap-koder i GitHub, skärmbilder eller vanlig chatt.
- **Barn och platsdata:** Bestäm tillsammans vilka uppgifter ni vill använda och vem som ska kunna se dem. Positionsdelning ska alltid vara frivillig.
- **Uppdateringar:** Workern kan kontrollera versioner; själva installationen av ny kod kommer att kräva en signerad release, kompatibilitetskontroll och administratörens godkännande.

## 5. Familjens planeringsblad (fyll i lokalt)

| Fråga | Ert beslut |
| --- | --- |
| Familjenamn | |
| Domän | |
| Första administratör | |
| Övriga vuxna och barn | |
| Gemensam hallskärm? | |
| Google Kalender? Vem äger kalendrarna? | |
| AI och GPS från start? | |
| Vem ansvarar för backup? | |
| Var sparas återställningsuppgifter? | |

**Fyll aldrig i lösenord, API-token eller hemliga nycklar i det här bladet.**

**Nästa steg:** Läs [Säkerhetsnycklar och återställning](sakerhet-och-nycklar-sv.md) och sedan [Planerad installationsguide](installationsguide-sv.md). Kontrollera först om det finns en signerad version under [GitHub Releases](https://github.com/valfrid/nerenportal-releases/releases).
