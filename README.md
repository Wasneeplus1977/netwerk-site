# netwerk.klakkeloos.com

De productpagina van Netwerk: startpagina, privacybeleid en supportpagina, in het
Nederlands en het Engels. Statisch — HTML, één stylesheet, een favicon en één
script voor het contactformulier. Geen trackers, geen cookies, geen cookiemelding nodig.

Apple eist een privacy-URL en een support-URL bij het inzenden van de app. Dat zijn:

- `https://netwerk.klakkeloos.com/privacy.html`
- `https://netwerk.klakkeloos.com/support.html`

## Publiceren

**GitHub is de bron, Plesk haalt op.** Bij elke push naar `main` roept GitHub een
webhook van Plesk aan; Plesk doet een `git pull` en zet de bestanden in de map van het
subdomein. Er staan nergens FTP-gegevens opgeslagen.

Publiceren is dus:

```
git add -A && git commit -m "…" && git push
```

Het instellen staat stap voor stap in `../cowork/02-subdomein-en-publiceren.md`. Kort:

1. Subdomein `netwerk.klakkeloos.com` aanmaken in Plesk, met een Let's
   Encrypt-certificaat (Apple accepteert geen `http://`).
2. Bij dat subdomein → **Git** → **Extern repository**, met de HTTPS-URL van de
   GitHub-repo.
3. Implementatiemodus op **automatisch**, implementatiemap op de documentmap van het
   subdomein.
4. De webhook-URL die Plesk toont plakken in GitHub → Settings → Webhooks.

## Waarom geen GitHub Action

Die stond hier eerst wel (uploaden via FTPS), maar Plesk kan het zelf ophalen. Dat is
minder werk en er hoeft geen wachtwoord in GitHub te staan. Draait er ooit een host
zónder Git-ondersteuning, dan is de FTP-route alsnog een prima uitwijk.

## Let op bij het bewerken

- Plesk zet de **hele** inhoud van de repo in de webmap. Dit bestand is straks dus ook te
  bekijken op `netwerk.klakkeloos.com/README.md`. Onschuldig, maar zet er niets in wat
  niet openbaar mag.
- Het contactadres staat op vier plekken: `privacy.html`, `privacy-en.html`,
  `support.html`, `support-en.html`. Nu overal `netwerk@klakkeloos.com`.
- Zodra de app in de winkel staat: een downloadknop op de startpagina, met de echte
  App Store-link.
