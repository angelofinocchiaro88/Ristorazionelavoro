# Calcolatore Costo Personale (CCNL Turismo)

Questa applicazione web permette di stimare il costo aziendale del personale nel settore **Turismo e Pubblici Esercizi** (Ristoranti, Bar, Catering, ecc.), partendo dal netto mensile desiderato dal dipendente.

L'applicazione offre un'interfaccia moderna e intuitiva per calcolare rapidamente il RAL (Reddito Annuo Lordo) e il costo totale a carico dell'azienda, includendo contributi INPS, TFR e IRAP.

## Caratteristiche Principali

*   **Calcolo Inverso:** Determina il costo aziendale partendo dal netto in busta paga.
*   **Profili CCNL Reali:** Selezione basata su mansioni specifiche del CCNL Turismo (es. Cameriere di Ristorante, Pizzaiolo, Barman, Capo Cuoco).
*   **Dettaglio Costi:** Visualizzazione chiara di RAL, contributi dipendente/azienda, IRPEF, TFR e IRAP.
*   **Integrazione IA (Gemini):** Utilizza l'intelligenza artificiale di Google Gemini per fornire:
    *   Descrizioni automatiche delle mansioni selezionate.
    *   Analisi e spunti ("Insights") sui costi calcolati.
*   **Design Responsivo:** Interfaccia curata e accessibile, realizzata con React e Tailwind CSS.

## Configurazione e Utilizzo Locale

### Prerequisiti

*   Node.js (versione 18 o superiore)
*   Una API Key di Google Gemini

### Installazione

1.  Clona il repository:
    ```bash
    git clone https://github.com/tuo-username/nome-repo.git
    cd nome-repo
    ```

2.  Installa le dipendenze:
    ```bash
    npm install
    ```

3.  Crea un file `.env` nella root del progetto e aggiungi la tua chiave API:
    ```env
    API_KEY=la_tua_chiave_api_qui
    ```

4.  Avvia il server di sviluppo:
    ```bash
    npm run dev
    ```

## Disclaimer

*L'utente prende atto che il calcolo del costo del personale fornito dall'applicazione è basato su parametri standardizzati e potrebbe non riflettere l'esatta situazione fiscale e contributiva dell'azienda o del lavoratore.*

Si consiglia sempre di consultare un consulente del lavoro per stime precise.

## Tecnologie

*   **Frontend:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS
*   **AI:** Google GenAI SDK
*   **Icons:** FontAwesome
