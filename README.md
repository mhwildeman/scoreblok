# Scoreblok

Mobielvriendelijk digitaal scoreblok, gebouwd met Next.js en TypeScript.

## Lokaal starten

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Vercel

Importeer deze repository in Vercel. Het framework wordt automatisch als Next.js herkend. Gebruik de standaardinstellingen: `npm run build`, geen aangepaste outputmap. Er zijn geen omgevingsvariabelen of database nodig.

## Gegevens

Spelersnamen, spelinstellingen en rondes worden automatisch opgeslagen onder `scoreblok-v1` in localStorage. De opslag geldt per browser, apparaat en domein. Privémodus of het wissen van browsergegevens kan de gegevens verwijderen. Een nieuw spel vervangt het huidige scoreblok; spelersnamen blijven behouden.

Kies 1–10 spelers, het hoogste of laagste puntentotaal als doel en een limiet in rondes of punten. Een puntenlimiet wordt bereikt zodra een speler dat aantal of meer punten heeft. Bij direct stoppen worden scores verwerkt in de getoonde spelersvolgorde. Als de ronde wordt afgemaakt, tellen alle spelers mee. Bij gelijke winnende scores zijn er meerdere winnaars.

Rondes kunnen worden aangepast. De stand en het einde worden opnieuw berekend; latere rondes die daardoor na het speleinde vallen vervallen.

## Controle

```sh
npm test
npm run typecheck
npm run build
```

## Installeren en offline gebruiken

Scoreblok is een PWA met een eigen app-icoon. Op Android verschijnt een installatieknop zodra de browser installatie aanbiedt. Anders staan de stappen voor het browsermenu in beeld. Op iOS toont de app instructies voor het deelmenu → ‘Zet op beginscherm’. De installatievraag verschijnt niet in de geïnstalleerde app en kan voor de huidige browsersessie worden gesloten.

Na het eerste online bezoek bewaart de service worker het scoreblok en de benodigde bestanden voor offline gebruik. Spelgegevens blijven in localStorage onder dezelfde sleutel staan. Installatie en service workers vereisen HTTPS (of localhost). De service worker wordt alleen in de productiebuild geregistreerd.

Elke Vercel-deployment krijgt automatisch een eigen versie op basis van de deployment-ID, met de commit-ID of een bouwtijdstip als terugval. De app controleert iedere minuut terwijl deze zichtbaar is, bij terugkeer naar de app en wanneer de internetverbinding terugkomt. Een nieuwe versie wordt eerst volledig gedownload. Daarna verschijnt ‘Nieuwe versie beschikbaar’ met een knop ‘Bijwerken’. Pas na die keuze herlaadt de app; opgeslagen scores blijven behouden. Niet-opgeslagen ronde-invoer moet eerst worden afgerond.

Een gesloten app kan geen controle uitvoeren; de melding verschijnt bij het volgende gebruik met internet. Hiervoor zijn geen Vercel-webhooks, pushabonnementen of extra omgevingsvariabelen nodig.

Controleer op een telefoon na deployment de installatie op iOS en Android. Test updates door een tweede deployment op hetzelfde domein te openen terwijl de geïnstalleerde app nog de eerste versie gebruikt. Test offline nadat de eerste installatie van de service worker is afgerond.
