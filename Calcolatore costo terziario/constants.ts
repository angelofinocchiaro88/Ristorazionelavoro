import { JobRole } from './types';

// Dati basati sul CCNL Turismo - Pubblici Esercizi, Ristorazione, Alberghi
// Le RAL minime sono stime basate sulle tabelle retributive e servono come punto di partenza per il calcolo.
export const JOB_ROLES: JobRole[] = [
  { title: "Direttore", level: "Quadro A", minRal: 32000 },
  { title: "Capo Servizio Catering", level: "I", minRal: 27000 },
  { title: "Capo Cuoco", level: "II", minRal: 25000 },
  { title: "Maître", level: "III", minRal: 23500 },
  { title: "Cuoco Unico", level: "III", minRal: 23500 },
  { title: "Barman Unico", level: "III", minRal: 23500 },
  { title: "Pizzaiolo", level: "IV", minRal: 22000 },
  { title: "Cameriere di Ristorante", level: "IV", minRal: 22000 },
  { title: "Barman", level: "IV", minRal: 22000 },
  { title: "Segretario", level: "IV", minRal: 21500 },
  { title: "Barista", level: "V", minRal: 20500 },
  { title: "Cameriere (Bar/Tavola Calda)", level: "V", minRal: 20500 },
  { title: "Commis di Sala/Cucina (esperto)", level: "VI Super", minRal: 19500 },
  { title: "Commis di Sala/Cucina", level: "VI", minRal: 19000 },
  { title: "Guardiano notturno", level: "VI", minRal: 18800 },
  { title: "Addetto Pulizie / Fattorino", level: "VII", minRal: 18000 },
];
