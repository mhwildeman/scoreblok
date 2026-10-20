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
