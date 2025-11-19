import React, { useState, useCallback, useEffect } from 'react';
import { JOB_ROLES } from './constants';
import type { JobRole, CalculationResult } from './types';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { getRoleDescription, getCostInsights } from './services/geminiService';

const App: React.FC = () => {
  const [netMonthly, setNetMonthly] = useState<string>('1500');
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string>(JOB_ROLES[7].title); // Default to "Cameriere di Ristorante"
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  const [roleDescription, setRoleDescription] = useState<string>('');
  const [isDescriptionLoading, setIsDescriptionLoading] = useState<boolean>(false);

  const [insights, setInsights] = useState<string>('');
  const [isInsightsLoading, setIsInsightsLoading] = useState<boolean>(false);

  const fetchRoleDescription = useCallback(async (roleTitle: string) => {
    const role = JOB_ROLES.find(r => r.title === roleTitle);
    if (!role) return;
    
    setIsDescriptionLoading(true);
    setRoleDescription('');
    const description = await getRoleDescription(role.title, role.level);
    setRoleDescription(description);
    setIsDescriptionLoading(false);
  }, []);

  useEffect(() => {
    if (selectedRoleTitle) {
      fetchRoleDescription(selectedRoleTitle);
    }
  }, [selectedRoleTitle, fetchRoleDescription]);

  const calculateCompanyCost = useCallback((netSalary: number, role: JobRole): CalculationResult => {
    const PAYSLIPS_PER_YEAR = 14; 
    const TARGET_NET_MONTHLY = netSalary;
    const INPS_EMPLOYEE_RATE = 0.0919;
    
    let estimatedGrossAnnual = TARGET_NET_MONTHLY * PAYSLIPS_PER_YEAR * 1.75; 
    let calculatedNetMonthly = 0;
    let iteration = 0;

    while (Math.abs(calculatedNetMonthly - TARGET_NET_MONTHLY) > 1 && iteration < 50) {
      const employeeInps = estimatedGrossAnnual * INPS_EMPLOYEE_RATE;
      const taxableIncome = estimatedGrossAnnual - employeeInps;

      let irpefGross = 0;
      if (taxableIncome <= 28000) {
        irpefGross = taxableIncome * 0.23;
      } else if (taxableIncome <= 50000) {
        irpefGross = 28000 * 0.23 + (taxableIncome - 28000) * 0.35;
      } else {
        irpefGross = 28000 * 0.23 + 22000 * 0.35 + (taxableIncome - 50000) * 0.43;
      }

      let deductions = 1880;
      if (taxableIncome > 25000 && taxableIncome <= 35000) {
         deductions = 1910 - (1190 * (taxableIncome - 25000) / 10000);
      } else if (taxableIncome > 35000) {
          deductions = 720;
      }
      
      const irpefNet = Math.max(0, irpefGross - deductions);
      const netAnnual = estimatedGrossAnnual - employeeInps - irpefNet;
      calculatedNetMonthly = netAnnual / PAYSLIPS_PER_YEAR;

      if (calculatedNetMonthly < TARGET_NET_MONTHLY) {
        estimatedGrossAnnual *= 1.01;
      } else {
        estimatedGrossAnnual *= 0.99;
      }
      iteration++;
    }

    const INPS_COMPANY_RATE = 0.28; 
    const TFR_RATE = 1 / 13.5;
    const IRAP_RATE = 0.039; 

    const grossAnnual = estimatedGrossAnnual;
    const employeeInps = grossAnnual * INPS_EMPLOYEE_RATE;
    const irpef = grossAnnual - employeeInps - (TARGET_NET_MONTHLY * PAYSLIPS_PER_YEAR);
    const companyInps = grossAnnual * INPS_COMPANY_RATE;
    const tfr = grossAnnual * TFR_RATE;
    const irapBase = grossAnnual + companyInps;
    const irap = irapBase * IRAP_RATE;
    const totalCompanyCost = grossAnnual + companyInps + tfr + irap;

    return {
      netMonthly: TARGET_NET_MONTHLY,
      netAnnual: TARGET_NET_MONTHLY * PAYSLIPS_PER_YEAR,
      grossAnnual,
      employeeInps,
      irpef,
      companyInps,
      tfr,
      irap,
      totalCompanyCost
    };
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setResults(null);
    setInsights('');

    const netValue = parseFloat(netMonthly);
    const roleData = JOB_ROLES.find(r => r.title === selectedRoleTitle);

    if (!isNaN(netValue) && roleData) {
      setTimeout(() => { 
        const calculatedResults = calculateCompanyCost(netValue, roleData);
        setResults(calculatedResults);
        setIsCalculating(false);
        setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }, 1000);
    } else {
      setIsCalculating(false);
    }
  };
  
  const handleGetInsights = async () => {
    if (!results) return;
    setIsInsightsLoading(true);
    setInsights('');
    const fetchedInsights = await getCostInsights(results);
    setInsights(fetchedInsights);
    setIsInsightsLoading(false);
  };


  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 text-slate-900 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        
        <header className="text-center mb-12">
           <div className="inline-block bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md mb-4 border border-slate-200 dark:border-slate-700">
             <i className="fa-solid fa-file-invoice-dollar text-4xl text-sky-500"></i>
           </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Costo Personale
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Stima il costo aziendale partendo dal netto mensile desiderato, basato sul CCNL Turismo e Pubblici Esercizi.
          </p>
        </header>

        <main>
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label htmlFor="net-monthly" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Netto Mensile (€)
                  </label>
                  <div className="relative">
                     <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">€</span>
                    </div>
                    <input
                      type="number"
                      id="net-monthly"
                      value={netMonthly}
                      onChange={(e) => setNetMonthly(e.target.value)}
                      className="w-full pl-7 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                      placeholder="Es. 1500"
                      required
                      min="500"
                      step="50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Mansione
                  </label>
                  <select
                    id="role"
                    value={selectedRoleTitle}
                    onChange={(e) => setSelectedRoleTitle(e.target.value)}
                    className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  >
                    {JOB_ROLES.map(role => (
                      <option key={role.title} value={role.title}>
                        {role.title} (Liv. {role.level})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <div className="mt-2 p-4 bg-sky-50 dark:bg-sky-900/40 rounded-lg text-sm text-slate-700 dark:text-sky-200 flex items-start min-h-[60px]">
                  <i className="fa-solid fa-briefcase text-sky-500 dark:text-sky-400 mt-1 mr-3 flex-shrink-0"></i>
                  <div className="flex-grow">
                    {isDescriptionLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 animate-pulse"></div> : roleDescription}
                  </div>
                </div>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  disabled={isCalculating}
                  className="w-full bg-sky-600 text-white font-bold text-lg py-4 px-6 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-all duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isCalculating ? (
                    <>
                      <LoadingSpinner size="sm"/>
                      <span className="ml-3">Calcolo in corso...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-calculator mr-3"></i> Calcola Costo Aziendale
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
          
          {results && (
            <ResultsDisplay 
              results={results} 
              onGetInsights={handleGetInsights}
              isInsightsLoading={isInsightsLoading}
              insights={insights}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default App;