import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { PREMIUM_PRICE } from '../constants';
import { MicIcon } from './icons';
import { createPaymentIntent } from '../services/paymentService';

// IMPORTANT: Your Stripe publishable key should be set as an environment variable.
// For example, in a .env file: `STRIPE_PUBLISHABLE_KEY=pk_test_...`
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

// Stripe must be loaded outside of a component’s render.
// We conditionally load Stripe only if the key is available.
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#e5e7eb', // text-gray-200
      fontFamily: '"Rajdhani", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#9ca3af', // text-gray-400
      },
    },
    invalid: {
      color: '#f87171', // text-red-400
      iconColor: '#f87171',
    },
  },
};

const CheckoutForm: React.FC<{ onSuccess: () => void; onGoBack: () => void; }> = ({ onSuccess, onGoBack }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        // When the form mounts, create a PaymentIntent on our simulated backend.
        // This replaces the old flow of creating a PaymentMethod on the client.
        createPaymentIntent()
            .then(data => setClientSecret(data.clientSecret))
            .catch(err => {
                setError(err.message || 'Failed to initialize payment.');
            });
    }, []);

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        if (!stripe || !elements || !clientSecret) {
            setError("Stripe.js has not loaded or payment is not ready. Please try again.");
            setProcessing(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError("Card element not found.");
            setProcessing(false);
            return;
        }
        
        // --- BACKEND PAYMENT CONFIRMATION SIMULATION ---
        // In a real application, you would now call `stripe.confirmCardPayment`.
        // That call would use the `clientSecret` to finalize the payment with Stripe.
        // e.g., const { error: confirmError } = await stripe.confirmCardPayment(...)
        
        // Since we don't have a real backend to generate a valid clientSecret,
        // calling `confirmCardPayment` would fail. Instead, we log the intended
        // action and simulate a successful payment to keep the UI functional.
        console.log("Payment flow is ready. In a real app, this step would confirm the payment with Stripe using the client secret.");
        console.log("Client Secret:", clientSecret);
        
        // Simulate network delay for processing
        setTimeout(() => {
            setProcessing(false);
            // If there were no errors from stripe.confirmCardPayment, call onSuccess.
            onSuccess();
        }, 1500);
    };

    const isReadyForPayment = !!stripe && !!clientSecret;

    return (
        <form onSubmit={handlePay}>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="card-element">
                    Credit or debit card
                </label>
                <div id="card-element" className={`bg-gray-800 border border-gray-700 rounded-md p-3.5 transition-opacity ${!isReadyForPayment ? 'opacity-50' : ''}`}>
                    <CardElement options={{...CARD_ELEMENT_OPTIONS, disabled: !isReadyForPayment}} />
                </div>
            </div>

            {error && <div className="text-red-400 text-sm mb-4 text-center" role="alert">{error}</div>}
            
            <div className="mt-8">
                 <button type="submit" disabled={!isReadyForPayment || processing} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30 disabled:bg-gray-600 disabled:cursor-not-allowed">
                    {processing ? 'Processing...' : !isReadyForPayment ? 'Initializing...' : `Pay $${PREMIUM_PRICE}`}
                </button>
                <button type="button" onClick={onGoBack} className="w-full text-center text-gray-400 mt-4 hover:text-white disabled:opacity-50" disabled={processing}>
                    Go Back
                </button>
            </div>
        </form>
    );
};


export const PaymentPage: React.FC<{ onSuccess: () => void; onGoBack: () => void; }> = ({ onSuccess, onGoBack }) => {
    // This state is now managed within the CheckoutForm for better encapsulation,
    // but we can use a local state here to handle the final success UI.
    const [isPaid, setIsPaid] = useState(false);

    const handleSuccess = () => {
        setIsPaid(true);
        // We delay the final callback to allow the success animation to be seen.
        setTimeout(onSuccess, 2000);
    };
    
    if (!stripePromise) {
        return (
             <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
                 <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
                    <h2 className="text-2xl font-orbitron text-red-400 mb-4">Stripe Not Configured</h2>
                    <p className="text-gray-300 mb-6">
                        Payment processing is not enabled. Please provide your
                        <code className="bg-gray-900 text-yellow-400 p-1 rounded-md mx-1">STRIPE_PUBLISHABLE_KEY</code>
                        as an environment variable.
                    </p>
                    <button type="button" onClick={onGoBack} className="text-center text-gray-400 hover:text-white">
                        Go Back
                    </button>
                 </div>
             </div>
        );
    }

    if (isPaid) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
                <div className="text-center bg-gray-800 p-10 rounded-lg shadow-2xl animate-fade-in-scale">
                    <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center bg-green-500 rounded-full">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-3xl font-orbitron text-white mb-2">Payment Successful!</h2>
                    <p className="text-gray-300 mb-6">Welcome to Premium. Your studio is now fully unlocked.</p>
                </div>
                 <style>{`
                    @keyframes fade-in-scale {
                      from { opacity: 0; transform: scale(0.95); }
                      to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards ease-out; }
                `}</style>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-grid-pattern">
            <style>{`.bg-grid-pattern { background-image: linear-gradient(rgba(10, 10, 10, 0.98), rgba(10, 10, 10, 0.98)), radial-gradient(circle at center, #1e3a8a 1px, transparent 1px); background-size: 100%, 30px 30px; }`}</style>
            <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-2xl overflow-hidden animate-fade-in-scale">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-orbitron text-white">Secure Checkout</h2>
                            <p className="text-gray-400">Upgrading to Premium.</p>
                        </div>
                        <MicIcon className="w-10 h-10 text-blue-400" />
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center mb-6">
                        <span className="text-gray-300">One-Time Payment</span>
                        <span className="text-2xl font-bold text-white">${PREMIUM_PRICE}.00 USD</span>
                    </div>

                    <Elements stripe={stripePromise}>
                        <CheckoutForm onSuccess={handleSuccess} onGoBack={onGoBack} />
                    </Elements>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-scale {
                  from { opacity: 0; transform: scale(0.95); }
                  to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards ease-out; }
            `}</style>
        </div>
    );
};