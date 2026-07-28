# netwerk.klakkeloos.com

De productpagina van Netwerk: startpagina, privacybeleid en supportpagina, in het
Nederlands en het Engels. Statisch — alleen HTML, één stylesheet en een favicon. Geen
scripts, geen cookies, geen trackers (dus ook geen cookiemelding nodig).

Apple eist een privacy-URL en een support-URL bij het inzenden van de app. Dat zijn:

- `https://netwerk.klakkeloos.com/privacy.html`
- `https://netwerk.klakkeloos.com/support.html`

## Publiceren

Elke push naar `main` zet de site live. Dat regelt `.github/workflows/deploy.yml`: die
logt in met FTPS en zet alleen de gewijzigde bestanden over. Op de host zelf hoeft niets
te draaien.

### Eenmalig instellen

1. **Subdomein aanmaken** in het configuratiescherm van de host:
   `netwerk.klakkeloos.com`. Noteer welke map daarbij hoort — bij DirectAdmin is dat
   meestal `domains/klakkeloos.com/public_html/netwerk/`.
2. **Certificaat aanzetten** voor dat subdomein (Let's Encrypt, staat in hetzelfde
   paneel). Apple accepteert alleen `https://`-adressen.
3. **Repo op GitHub zetten** en deze map erin pushen.
4. **Vier geheimen klaarzetten** onder Settings → Secrets and variables → Actions →
   *New repository secret*:

   | Naam | Waarde |
   |---|---|
   | `FTP_HOST` | het FTP-adres van de host, bijv. `ftp.klakkeloos.com` |
   | `FTP_USER` | de FTP-gebruikersnaam |
   | `FTP_PASSWORD` | het FTP-wachtwoord |
   | `FTP_SERVER_DIR` | de map uit stap 1, **met een schuine streep aan het eind** |

5. **Eén keer met de hand starten** via het tabblad Actions → *Publiceer naar
   netwerk.klakkeloos.com* → Run workflow. Zie je groen, dan staat de site erop.

### Als het misgaat

- **Time-out of "530 Login incorrect"** — controleer of het FTP-adres, de gebruikersnaam
  en het wachtwoord kloppen. Sommige hosts willen de volledige gebruikersnaam
  (`gebruiker@klakkeloos.com`).
- **De bestanden komen op de verkeerde plek terecht** — `FTP_SERVER_DIR` klopt niet.
  Log één keer met een FTP-programma in en kijk in welke map `index.html` hoort te staan.
- **"FTPS not supported"** — zet `protocol: ftps` in het workflow-bestand om naar `ftp`.
  Dan gaat het wachtwoord onversleuteld over de lijn; vraag de host liever eerst of FTPS
  aangezet kan worden.

## Wat je nog kunt aanpassen

- Het contactadres staat op vier plekken: `privacy.html`, `privacy-en.html`,
  `support.html`, `support-en.html`. Nu overal `bvangogh@mac.com`.
- Zodra de app in de winkel staat: een downloadknop op de startpagina, met de echte
  App Store-link.
