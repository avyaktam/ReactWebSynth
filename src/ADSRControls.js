// ADSRControls.js
import React from 'react';
import { useSynthContext } from './SynthContext';
import ADSREnvelopeVisualizer from './ADSREnvelopeVisualizer';

const ADSRControls = () => {
    // Corrected use of useSynthContext without passing SynthContext
    const { adsr, setADSR, volume, setVolume, audioContext, oscillators } = useSynthContext();
  
    const handleADSRChange = (param, value) => {
      const newADSR = { ...adsr, [param]: parseFloat(value) };
      setADSR(newADSR);
  
      // Apply the changes to all active oscillators. You need to ensure this functionality is supported in your context
      oscillators.forEach(({ oscillator, gainNode }) => {
        applyEnvelope(gainNode, newADSR, audioContext);
      });
    };
  
    // Function to apply the ADSR envelope to the gainNode
    const applyEnvelope = (gainNode, adsrValues) => {
      const { attack, decay, sustain, release } = adsrValues;
      const now = audioContext.currentTime;
  
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(1, now + attack);
      gainNode.gain.linearRampToValueAtTime(sustain, now + attack + decay);
      // Note: Handling of release would typically occur elsewhere, such as in a function to stop the note
    };

return (
  <div className="adsr-controls">
    <label>
      Attack:
      <input
        type="range"
        min="0.01"
        max="5"
        step="0.01"
        value={adsr.attack}
        onChange={(e) => handleADSRChange('attack', e.target.value)}
      />
      {adsr.attack}
    </label>
    {/* Do the same for the other sliders */}
    <label>
      Decay:
      <input
        type="range"
        min="0.01"
        max="5"
        step="0.01"
        value={adsr.decay}
        onChange={(e) => handleADSRChange('decay', e.target.value)}
      />
      {adsr.decay}
    </label>
    <label>
      Sustain:
      <input
        type="range"
        min="0.01"
        max="5"
        step="0.01"
        value={adsr.sustain}
        onChange={(e) => handleADSRChange('sustain', e.target.value)}
      />
      {adsr.sustain}
    </label>
    <label>
      Release:
      <input
        type="range"
        min="0"
        max="5"
        step="0.01"
        value={adsr.release}
        onChange={(e) => handleADSRChange('release', e.target.value)}
      />
      {adsr.release}
    </label>
    <div className="adsr-visualization">
      <ADSREnvelopeVisualizer adsr={adsr} />
    </div>
  </div>
)};

export default ADSRControls;