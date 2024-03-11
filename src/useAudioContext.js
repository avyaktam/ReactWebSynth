// useAudioContext.js
import { useState, useEffect } from 'react';

export const useAudioContext = () => {
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    // Create AudioContext once
    let context = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(context);

    // Cleanup function to close the audio context
    return () => {
      if (context && context.state !== 'closed') {
        context.close();
      }
    };
  }, []);

  return audioContext;
};
