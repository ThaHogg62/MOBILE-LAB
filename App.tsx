
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Pricing } from './components/Pricing';
import { HowItWorks } from './components/HowItWorks';
import { SignInModal } from './components/SignInModal';
import { PaymentPage } from './components/PaymentPage';
import { Studio } from './components/Studio';
import { User, SubscriptionTier } from './types';
import { onAuthChange, signOut, signInWithGoogle, signInWithApple } from './services/authService';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(SubscriptionTier.Free);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [view, setView] = useState<'app' | 'payment'>('app');

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatarUrl: firebaseUser.photoURL,
        });
        // Check for a persisted subscription state
        const persistedTier = localStorage.getItem(`subscription_${firebaseUser.uid}`);
        if (persistedTier === SubscriptionTier.Premium) {
          setSubscriptionTier(SubscriptionTier.Premium);
        } else {
          setSubscriptionTier(SubscriptionTier.Free);
        }
      } else {
        setUser(null);
        setSubscriptionTier(SubscriptionTier.Free);
      }
      setIsLoading(false);
    });

    // Unsubscribe on cleanup
    return () => unsubscribe();
  }, []);

  const handleSignIn = async (provider: 'google' | 'apple') => {
    const signInFunction = provider === 'google' ? signInWithGoogle : signInWithApple;
    await signInFunction();
    setIsSignInModalOpen(false);
  };

  const handleSignOut = useCallback(() => {
    if (user) {
      // Clear persisted state on sign out
      localStorage.removeItem(`subscription_${user.uid}`);
    }
    signOut();
    setView('app');
  }, [user]);

  const handleSubscribe = useCallback(() => {
    if (!user) {
      setIsSignInModalOpen(true);
      return;
    }
    setView('payment');
  }, [user]);
  
  const handleSuccessfulPayment = useCallback(() => {
      setSubscriptionTier(SubscriptionTier.Premium);
      if (user) {
          // Persist subscription state locally
          localStorage.setItem(`subscription_${user.uid}`, SubscriptionTier.Premium);
      }
      setView('app');
      alert('Subscription successful! You now have Premium access.');
  }, [user]);

  const handleGoBackFromPayment = useCallback(() => {
      setView('app');
  }, []);

  const openSignInModal = useCallback(() => setIsSignInModalOpen(true), []);
  const closeSignInModal = useCallback(() => setIsSignInModalOpen(false), []);

  if (isLoading) {
      return (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="font-orbitron text-2xl text-blue-400">Loading Tha Lab...</div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header user={user} onSignInClick={openSignInModal} onSignOut={handleSignOut} />
      
      <main>
        {view === 'payment' && user ? (
            <PaymentPage onSuccess={handleSuccessfulPayment} onGoBack={handleGoBackFromPayment} />
        ) : (
          <>
            {user ? (
              <Studio user={user} subscriptionTier={subscriptionTier} onUpgrade={handleSubscribe} />
            ) : (
              <>
                <Hero onGetStartedClick={openSignInModal} />
                <HowItWorks />
                <Pricing onSubscribeClick={handleSubscribe} />
                <footer className="text-center py-8 text-gray-500 border-t border-gray-800">
                  <p>&copy; {new Date().getFullYear()} Tha Mobile Lab. All Rights Reserved.</p>
                </footer>
              </>
            )}
          </>
        )}
      </main>

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
        onSignIn={handleSignIn}
      />
    </div>
  );
};
