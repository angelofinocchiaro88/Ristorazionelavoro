
import React from 'react';
import type { CalculationResult } from '../types';

interface ResultsDisplayProps {
  results: CalculationResult;
  onGetInsights: () => void;
  isInsightsLoading: boolean;
  insights: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
};

const ResultRow: React.FC<{ label: string; value: number; icon: string; tooltip?: string, isSubtle?: boolean }> = ({ label, value, icon, tooltip, isSubtle=false }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
    <div className="flex items-center">
        <i className={`${icon} fa-fw w-6 text-center ${isSubtle ? 'text-slate-400' : 'text-sky-500'}`}></i>
        <span className={`ml-3 text-sm md:text-base ${isSubtle ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
            {label}
            {tooltip && (
                <i className="fas fa-info-circle ml-2 text-slate-400 cursor-help" title={tooltip}></i>
            )}
        </span>
    </div>
    <span className={`font-semibold text-base md:text-lg ${isSubtle ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
      {formatCurrency(value)}
    </span>
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onGetInsights, isInsightsLoading, insights }) => {
  return (
    <div id="results" className="w-full max-w-3xl mx-auto mt-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-6 text-center">Riepilogo Costo</h2>

            <div className="space-y-4">
                {/* Dipendente */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Dettaglio Dipendente</h3>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700">
                        <ResultRow label="Netto Mensile (input)" value={results.netMonthly} icon="fa-solid fa-hand-holding-dollar" />
                        <ResultRow label="Netto Annuale (14x)" value={results.netAnnual} icon="fa-solid fa-calendar-check" />
                        <ResultRow label="Reddito Annuo Lordo (RAL)" value={results.grossAnnual} icon="fa-solid fa-file-invoice-dollar" tooltip="La retribuzione lorda prima di tasse e contributi." />
                        <ResultRow label="Contributi INPS (su RAL)" value={results.employeeInps} icon="fa-solid fa-user-shield" isSubtle={true} />
                        <ResultRow label="IRPEF Netta (su RAL)" value={results.irpef} icon="fa-solid fa-landmark" isSubtle={true} tooltip="L'imposta sul reddito delle persone fisiche."/>
                    </div>
                </div>

                {/* Azienda */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Costi Aggiuntivi Azienda</h3>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700">
                        <ResultRow label="Contributi INPS" value={results.companyInps} icon="fa-solid fa-building-shield" />
                        <ResultRow label="TFR" value={results.tfr} icon="fa-solid fa-piggy-bank" tooltip="Quota annuale accantonata per la liquidazione."/>
                        <ResultRow label="IRAP (stima)" value={results.irap} icon="fa-solid fa-map-location-dot" tooltip="Imposta Regionale sulle Attività Produttive." />
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-sky-100 dark:bg-sky-900/50 p-6 flex justify-between items-center">
             <span className="text-lg font-bold text-sky-800 dark:text-sky-200">Costo Totale Annuale Azienda</span>
             <span className="text-2xl md:text-3xl font-extrabold text-sky-600 dark:text-sky-300">
                {formatCurrency(results.totalCompanyCost)}
             </span>
        </div>

        <div className="p-6 md:p-8 text-center border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onGetInsights}
            disabled={isInsightsLoading}
            className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg hover:from-sky-600 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-all duration-300 ease-in-out disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            {isInsightsLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analisi in corso...
                </>
            ) : (
                <>
                 <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Ottieni Spunti dall'IA
                </>
            )}
          </button>
        </div>

        {insights && (
          <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center"><i className="fa-solid fa-lightbulb text-yellow-400 mr-3"></i>Spunti Generati dall'IA</h3>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: insights }}></div>
          </div>
        )}

      </div>
       <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 max-w-xl mx-auto italic">
          L'utente prende atto che il calcolo del costo del personale fornito dall'applicazione è basato su parametri standardizzati e potrebbe non riflettere l'esatta situazione fiscale e contributiva dell'azienda o del lavoratore.
        </p>
    </div>
  );
};

export default ResultsDisplay;
