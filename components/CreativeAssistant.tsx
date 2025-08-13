
import React, { useState } from 'react';
import { MagicIcon } from './icons';
import { generateCreativeIdea } from '../services/geminiService';

export const CreativeAssistant: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    setError('');
    setIdea('');
    try {
      const result = await generateCreativeIdea(topic);
      setIdea(result);
    } catch (e: any) {
      setError(e.message || 'Failed to generate idea.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <h3 className="flex items-center font-bold text-blue-400 mb-3">
        <MagicIcon className="w-5 h-5 mr-2" />
        Creative Assistant
      </h3>
      <p className="text-sm text-gray-400 mb-4">Stuck? Describe what you need an idea for (e.g., "sad piano melody", "funky bassline").</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic..."
          className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      {idea && (
        <div className="mt-4 p-3 bg-gray-900 rounded-md border border-gray-700">
          <p className="text-gray-300">{idea}</p>
        </div>
      )}
    </div>
  );
};
