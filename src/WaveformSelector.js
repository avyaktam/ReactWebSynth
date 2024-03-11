// WaveformSelector.js
import React from 'react';
import { useSynthContext } from './SynthContext';

const waveforms = ['sine', 'square', 'sawtooth', 'triangle'];

const WaveformSelector = () => {
  const { waveform, setWaveform } = useSynthContext();
  
  return (
    <div>
      <h3>Select Waveform</h3>
      {waveforms.map(wf => (
        <button
          key={wf}
          onClick={() => setWaveform(wf)}
          style={{ fontWeight: waveform === wf ? 'bold' : 'normal' }}
        >
          {wf}
        </button>
      ))}
    </div>
  );
};

export default WaveformSelector;
