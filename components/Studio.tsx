
import React, { useState, useMemo } from 'react';
import { SubscriptionTier, Track as TrackType, User } from '../types';
import { TRACK_LIMITS } from '../constants';
import { PlayIcon, PauseIcon, StopIcon, RecordIcon, SaveIcon, MicIcon } from './icons';
import { CreativeAssistant } from './CreativeAssistant';

// Standalone component to prevent re-definition on re-render
const Track: React.FC<{ track: TrackType; onArm: (id: number) => void; onMute: (id: number) => void; onSolo: (id: number) => void; onTogglePreset: (id: number) => void; isPremium: boolean; }> = ({ track, onArm, onMute, onSolo, onTogglePreset, isPremium }) => (
    <div className="flex items-center bg-gray-800 p-3 rounded-lg border border-gray-700 space-x-4">
        <div className="flex items-center space-x-2 w-1/4">
            <span className="text-gray-400">{String(track.id).padStart(2, '0')}</span>
            <input type="text" defaultValue={track.name} className="bg-transparent text-white w-full outline-none" />
        </div>
        <div className="flex items-center space-x-2 flex-grow">
            <button onClick={() => onMute(track.id)} className={`w-8 h-8 rounded-md font-bold ${track.isMuted ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-300'} hover:bg-yellow-600 transition-colors`}>M</button>
            <button onClick={() => onSolo(track.id)} className={`w-8 h-8 rounded-md font-bold ${track.isSolo ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'} hover:bg-blue-600 transition-colors`}>S</button>
            <button onClick={() => onArm(track.id)} className={`w-8 h-8 rounded-md flex items-center justify-center ${track.isArmed ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-700 text-gray-300'} hover:bg-red-700 transition-colors`}>
                <MicIcon className="w-5 h-5"/>
            </button>
        </div>
        <div className="w-1/3 flex items-center justify-end space-x-4">
            <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Vocal FX</span>
                <button
                    onClick={() => onTogglePreset(track.id)}
                    disabled={!isPremium}
                    title={isPremium ? "Toggle Real-time Vocal Preset" : "Available for Premium users"}
                    className={`w-10 h-5 rounded-full p-1 transition-colors ${track.useVocalPreset ? 'bg-blue-500' : 'bg-gray-600'} ${!isPremium ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${track.useVocalPreset ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </button>
            </div>
            <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </div>
    </div>
);

export const Studio: React.FC<{ user: User; subscriptionTier: SubscriptionTier; onUpgrade: () => void }> = ({ user, subscriptionTier, onUpgrade }) => {
  const isPremium = subscriptionTier === SubscriptionTier.Premium;
  const trackLimit = useMemo(() => TRACK_LIMITS[subscriptionTier], [subscriptionTier]);

  const [tracks, setTracks] = useState<TrackType[]>(() =>
    Array.from({ length: 1 }, (_, i) => ({
      id: i + 1,
      name: `Audio Track ${i + 1}`,
      isMuted: false,
      isSolo: false,
      isArmed: i === 0,
      useVocalPreset: false,
    }))
  );
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const addTrack = () => {
    if (tracks.length < trackLimit) {
      setTracks(prev => [...prev, {
        id: prev.length + 1,
        name: `Audio Track ${prev.length + 1}`,
        isMuted: false,
        isSolo: false,
        isArmed: false,
        useVocalPreset: false
      }]);
    } else {
        alert(isPremium ? "You have reached the maximum of 10 tracks." : "Upgrade to Premium to add more than 4 tracks.");
        if(!isPremium) onUpgrade();
    }
  };

  const handleArm = (id: number) => setTracks(t => t.map(track => track.id === id ? { ...track, isArmed: !track.isArmed } : track));
  const handleMute = (id: number) => setTracks(t => t.map(track => track.id === id ? { ...track, isMuted: !track.isMuted } : track));
  const handleSolo = (id: number) => setTracks(t => t.map(track => track.id === id ? { ...track, isSolo: !track.isSolo } : track));
  const handleTogglePreset = (id: number) => {
      if(isPremium){
          setTracks(t => t.map(track => track.id === id ? {...track, useVocalPreset: !track.useVocalPreset} : track));
      }
  };

  const handleRecord = () => {
      setIsRecording(true);
      setIsPlaying(true);
  }
  
  const handleStop = () => {
      setIsPlaying(false);
      setIsRecording(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-center bg-gray-800/30 p-4 rounded-lg border border-gray-700">
        <div>
            <h2 className="text-2xl font-orbitron text-white">Session: My Project</h2>
            <p className="text-sm text-gray-400">Welcome, {user.name || 'Producer'} ({subscriptionTier} User)</p>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4 mt-4 md:mt-0">
          <button onClick={() => setIsPlaying(p => !p)} className="p-3 bg-gray-700 rounded-full text-white hover:bg-blue-600 transition-colors">
            {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
          </button>
          <button onClick={handleStop} className="p-3 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors">
            <StopIcon className="w-6 h-6"/>
          </button>
          <button onClick={handleRecord} className={`p-3 rounded-full text-white transition-colors ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-gray-700 hover:bg-red-600'}`}>
            <RecordIcon className="w-6 h-6"/>
          </button>
          <button title="Save to Device" className="p-3 bg-gray-700 rounded-full text-white hover:bg-green-600 transition-colors">
              <SaveIcon className="w-6 h-6"/>
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xl font-bold text-gray-300">Tracks ({tracks.length}/{trackLimit})</h3>
          <div className="space-y-2 h-[60vh] overflow-y-auto pr-2">
            {tracks.map(track => <Track key={track.id} track={track} onArm={handleArm} onMute={handleMute} onSolo={handleSolo} onTogglePreset={handleTogglePreset} isPremium={isPremium} />)}
          </div>
          <button onClick={addTrack} className="w-full py-2 bg-blue-600/20 text-blue-300 border border-blue-500 rounded-lg hover:bg-blue-600/40 transition-colors">
            + Add Track
          </button>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-bold text-gray-300">Tools</h3>
            {isPremium ? (
              <CreativeAssistant />
            ) : (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                    <h4 className="font-bold text-blue-400 mb-2">Upgrade to Unlock Tools</h4>
                    <p className="text-sm text-gray-400 mb-4">Get the Creative Assistant and more with a Premium account.</p>
                    <button onClick={onUpgrade} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-500 transition-colors">Upgrade Now</button>
                </div>
            )}

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                 <h3 className="text-xl font-bold text-gray-300 mb-4">Master Output</h3>
                 <div className="flex items-center space-x-4">
                     <span className="text-sm text-gray-400">Vol</span>
                     <input type="range" min="0" max="100" defaultValue="80" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg" />
                 </div>
            </div>
        </div>
      </main>
    </div>
  );
};