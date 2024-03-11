import React from 'react';
import { SynthProvider } from './SynthContext';
import Display from './Display';
import OscillatorControls from './OscillatorControls';
// Import other components

function Synth() {
  return (
    <SynthProvider>
      <div className="synth">
        <Display />
        <OscillatorControls />
        {/* Render other components here */}
      </div>
    </SynthProvider>
  );
}

export default Synth;
