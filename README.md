# Personal Trainer Dashboard - Frontend-projekti

## Projektin kuvaus

Tämä on React-pohjainen Single Page Application (SPA), joka toimii Personal Trainer -palvelun hallintakäyttöliittymänä. Sovellus kommunikoi REST API:n kanssa ja tarjoaa neljä päänäkymää: asiakkaat, harjoitukset, kalenteri ja tilastot.

## Ominaisuudet

### Asiakkaat-sivu
- Asiakaslista taulukkomuodossa
- Lajittelu ja suodatus kaikilla kentillä
- Uuden asiakkaan lisääminen (modal)
- Asiakkaan tietojen muokkaaminen
- Asiakkaan poistaminen (vahvistusdialogi)
- Asiakkaan harjoitusten määrä näkyvissä
- CSV-vienti

### Harjoitukset-sivu
- Harjoituslista taulukkomuodossa
- Lajittelu päivämäärän, aktiviteetin, keston ja asiakkaan mukaan
- Suodatus kaikilla kentillä
- Uuden harjoituksen lisääminen (modal)
- Harjoituksen poistaminen

### Kalenteri-sivu
- Viikko-, kuukausi- ja päivänäkymä
- react-big-calendar-kirjasto
- Suomenkielinen lokalisaatio
- Harjoitukset näkyvät kalenterissa väreillä eroteltuna

### Tilastot-sivu
- Pylväsdiagrammi harjoitusaktiviteeteista
- Recharts-kirjasto
- Kokonaisminuutit ja sessioiden määrä

## Teknologiat

- **React 19** - UI-kirjasto
- **TypeScript** - Tyyppiturvallisuus
- **Vite** - Build-työkalu
- **React Router** - Reititys
- **react-big-calendar** - Kalenterikomponentti
- **recharts** - Tilastografiikat
- **date-fns** - Päivämääräkäsittely
- **lodash** - Apufunktiot

## Asennus ja käyttö

### Vaatimukset
- Node.js 18+ 
- npm 9+

### Asennus
```bash
npm install
```

### Kehitysympäristö
```bash
npm run dev
```
Sovellus käynnistyy osoitteeseen http://localhost:5173

### Tuotantobuild
```bash
npm run build
```

### ESLint
```bash
npm run lint
```

## API-integraatio

Sovellus käyttää ulkoista REST API:a:
- Base URL: `https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api`
- Resurssit: `/customers`, `/trainings`

## Projektin rakenne

```
src/
├── App.tsx              # Pääkomponentti ja reititys
├── main.tsx             # Entry point
├── types.ts             # TypeScript-tyypit
├── components/
│   ├── CustomerFormModal.tsx
│   ├── Modal.tsx
│   └── TrainingFormModal.tsx
├── pages/
│   ├── CustomersPage.tsx
│   ├── TrainingsPage.tsx
│   ├── CalendarPage.tsx
│   └── StatisticsPage.tsx
├── services/
│   └── personalTrainerApi.ts   # API-kutsut
└── utils/
    └── formatters.ts            # Apumuotoilijat
```

## Käyttöliittymä

- Responsiivinen suunnittelu
- Suomenkielinen käyttöliittymä
- Tilaviestit (onnistuminen/virhe)
- Lataustilat
- Modaalilomakkeet

## Kehitystyökalut

- VS Code
- ESLint + TypeScript
- Vite HMR

---

**Tekijä:** [Nimi]
**Päivämäärä:** 2026
**Kurssi:** Frontend-kehitäjä
