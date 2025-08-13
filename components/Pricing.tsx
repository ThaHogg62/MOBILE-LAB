import React from 'react';
import { PREMIUM_PRICE, FREE_TRACK_LIMIT, PREMIUM_TRACK_LIMIT } from '../constants';
import { EQIcon } from './icons';

interface PricingProps {
  onSubscribeClick: () => void;
}

const CheckIcon = () => (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);

const PlanFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center">
        <CheckIcon />
        <span className="ml-3 text-gray-300">{children}</span>
    </li>
);

export const Pricing: React.FC<PricingProps> = ({ onSubscribeClick }) => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-center text-white mb-12">
          Choose Your Plan
        </h3>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="group bg-gray-800 border border-gray-700 rounded-lg p-8 transition-all duration-300 hover:border-gray-500 hover:shadow-2xl">
            <div className="flex justify-between items-center">
                <h4 className="text-2xl font-bold text-white mb-2">Free</h4>
                <EQIcon className="w-8 h-8 text-gray-600 transition-colors group-hover:text-gray-400" />
            </div>
            <p className="text-gray-400 mb-6 h-12">Perfect for starting out and basic projects.</p>
            <p className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-gray-400"> / forever</span></p>
            <ul className="space-y-4 mb-8">
                <PlanFeature>{FREE_TRACK_LIMIT} Audio Tracks</PlanFeature>
                <PlanFeature>Drag & Drop Interface</PlanFeature>
                <PlanFeature>Save to Device</PlanFeature>
            </ul>
             <button
                disabled
                className="w-full bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg cursor-default">
                Your Current Plan
            </button>
          </div>

          {/* Premium Tier */}
          <div className="group bg-gray-800 border border-blue-500/50 rounded-lg p-8 relative overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-600/20 hover:scale-105">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">MOST POPULAR</div>
            <div className="flex justify-between items-center">
                <h4 className="text-2xl font-bold text-blue-400 mb-2">Premium</h4>
                <EQIcon className="w-8 h-8 text-gray-600 transition-colors group-hover:text-blue-400" />
            </div>
            <p className="text-gray-400 mb-6 h-12">Unlock the full potential of your mobile studio with all features.</p>
            <p className="text-4xl font-bold text-white mb-6">${PREMIUM_PRICE}<span className="text-lg text-gray-400"> / one-time</span></p>
            <ul className="space-y-4 mb-8">
               <PlanFeature>{PREMIUM_TRACK_LIMIT} Audio Tracks</PlanFeature>
               <PlanFeature>Real-time Vocal Preset</PlanFeature>
               <PlanFeature>AI Creative Assistant</PlanFeature>
            </ul>
            <button
                onClick={onSubscribeClick}
                className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors hover:bg-blue-500 shadow-lg shadow-blue-600/30">
                Go Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
