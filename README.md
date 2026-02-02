## SmartSearchbar (NTS) — Prototype

Dit project is een **prototype** van een AI-ondersteunde zoekinterface voor de **NTS (Nederlandse Transplantatie Stichting)**. Het is bedoeld om interacties en UI/UX te toetsen (suggesties, filters, resultatenweergave) en **geen productie-implementatie**.

### Features
- **Zoekbalk met focus/typing states**
  - Direct typen mogelijk
  - Tijdens typen verschijnen **Enter** en **wissen (X)**; microfoon verdwijnt
- **Suggesties & quicklinks**
  - Suggesties passen dynamisch mee met de invoer
  - Quicklinks als klikbare items
- **Filters**
  - Filters selecteren via:
    - “Specificeer wat je zoekt” (startscherm)
    - **Filter dropdown** (tijdens typen / suggesties)
  - **Actieve filters** verschijnen als **horizontale carousel** (geen wrapping) met subtiele **fade-out gradient** bij overflow
  - Filters individueel verwijderen of **“Filters uitzetten”** (alles wissen)
- **Resultatenpagina**
  - Gestylede AI-answer sectie, highlighted card, related results en bottom search

### Tech stack
- **HTML / CSS / Vanilla JavaScript**
- **Font Awesome** (iconen)
- Lokale fonts: **Roobert** (`/fonts`)

### Lokaal draaien
Omdat dit een statische prototype is, kun je het simpel lokaal serveren.

**Optie 1: Node**

`bash`

`cd SmartSearchbar`

`node simple-server.js`


**Optie 2: Python**

`bash`

`cd SmartSearchbar`

`python3 -m http.server 3000`


Open daarna in je browser: `http://localhost:3000`

### Deploy
Dit project is gekoppeld aan **Vercel**. Elke push naar `main` op GitHub triggert automatisch een nieuwe deploy.

### Bestanden
- `index.html` — structuur van de UI
- `styles.css` — styling / design tokens / layout
- `app.js` — states, suggesties, filterlogica, interacties
- `fonts/` — Roobert fontbestanden
- `simple-server.js` — kleine lokale server voor development

### Opmerking
Dit is een UI/interaction prototype. Data, AI-antwoorden en content zijn (deels) gesimuleerd om het gedrag te kunnen testen.
