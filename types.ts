
export enum SubscriptionTier {
  Free = 'Free',
  Premium = 'Premium',
}

export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
}

export interface Track {
  id: number;
  name: string;
  isMuted: boolean;
  isSolo: boolean;
  isArmed: boolean;
  useVocalPreset: boolean;
}

export interface MixerState {
  volume: number; // 0-100
  pan: number; // -100 (L) to 100 (R)
}
