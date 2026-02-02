
import React from 'react';
import { PLANS } from '../constants';
import { PlanType } from '../types';
import { Check, Sparkles } from 'lucide-react';

const Plans: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Escolha o Plano Ideal para seu Negócio</h1>
        <p className="text-gray-500 text-lg">Escale sua produção de conteúdo com a inteligência artificial mais avançada.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.type}
            className={`bg-white p-8 rounded-3xl border-2 flex flex-col relative transition-all hover:scale-105 ${
              plan.type === PlanType.PRO ? 'border-indigo-600 shadow-xl shadow-indigo-100' : 'border-gray-100'
            }`}
          >
            {plan.type === PlanType.PRO && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <Sparkles size={14} />
                Mais Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wider">{plan.type}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-1">/ mês</span>
              </div>
              <p className="text-indigo-600 font-bold mt-2">{plan.credits} artes / semana</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                  <div className="mt-0.5 p-0.5 bg-indigo-50 text-indigo-600 rounded-full shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
              plan.type === PlanType.PRO 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' 
                : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border'
            }`}>
              Assinar Agora
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 text-white rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Precisa de uma Solução Customizada?</h2>
          <p className="text-gray-400">Para agências com alta demanda, oferecemos faturamento corporativo e acesso via API.</p>
        </div>
        <button className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold whitespace-nowrap hover:bg-gray-100 transition-colors">
          Falar com Especialista
        </button>
      </div>
    </div>
  );
};

export default Plans;
