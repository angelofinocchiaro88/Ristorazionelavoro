import { GoogleGenAI } from "@google/genai";
import type { CalculationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getRoleDescription(roleTitle: string, roleLevel: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Fornisci una breve descrizione (massimo 2 frasi) delle mansioni tipiche per un/una "${roleTitle}" (Livello ${roleLevel}) secondo il CCNL Turismo e Pubblici Esercizi in Italia. Sii conciso, professionale e scrivi in italiano.`,
    });
    return response.text ?? "Descrizione non disponibile.";
  } catch (error) {
    console.error("Error fetching role description:", error);
    return "Impossibile caricare la descrizione del ruolo in questo momento.";
  }
}

export async function getCostInsights(costBreakdown: CalculationResult): Promise<string> {
  try {
    const prompt = `
      Analizzando la seguente ripartizione del costo del lavoro per un'azienda in Italia, fornisci alcuni spunti generali e informativi in formato HTML semplice.
      
      Dati di costo:
      - Netto Mensile: ${costBreakdown.netMonthly.toFixed(2)} €
      - RAL (Reddito Annuo Lordo): ${costBreakdown.grossAnnual.toFixed(2)} €
      - Costo Totale Aziendale: ${costBreakdown.totalCompanyCost.toFixed(2)} €

      Struttura la risposta usando solo i tag HTML <p>, <strong>, <ul>, <li> e <em>. Non includere <html>, <head> o <body> tags.
      
      La risposta deve avere questa struttura:
      
      <p><strong>Spiegazione Voci Principali</strong></p>
      <ul>
        <li><strong>Contributi INPS (Azienda):</strong> Spiega brevemente a cosa servono.</li>
        <li><strong>TFR:</strong> Spiega brevemente cos'è.</li>
      </ul>
      
      <p><strong>Rapporto Costo/Netto</strong></p>
      <p>Fai una considerazione generale sul rapporto tra il costo totale per l'azienda e il netto percepito dal dipendente, evidenziando il peso del cuneo fiscale e contributivo in Italia.</p>
      
      <p><em><strong>Disclaimer:</strong> Questa è un'analisi generica basata su stime e non costituisce una consulenza finanziaria o fiscale. Per dati precisi, consultare un professionista.</em></p>

      Scrivi in italiano, in modo chiaro e professionale.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text ?? "<p>Impossibile caricare gli approfondimenti.</p>";
  } catch (error) {
    console.error("Error fetching cost insights:", error);
    return "<p>Impossibile caricare gli approfondimenti in questo momento. Riprova più tardi.</p>";
  }
}