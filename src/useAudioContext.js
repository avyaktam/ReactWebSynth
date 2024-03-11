import { useState, useEffect } from 'react';

export const useAudioContext = () => {
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    // Create AudioContext once
    const context = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(context);

    // Cleanup function to close the audio context when the component unmounts
    return () => {
      if (context.state !== 'closed') {
        context.close();
      }
    };
  }, []);

  // Function to resume the AudioContext if needed
  const resumeAudioContext = async () => {
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }
  };

  return [audioContext, resumeAudioContext];
};
