//SynthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAudioContext } from './useAudioContext'; 

const SynthContext = createContext();
const baseOctave = 4;
const scale = {
  'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63,
  'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00,
  'A#': 466.16, 'B': 493.88,
};
export const useSynthContext = () => useContext(SynthContext);

export const SynthProvider = ({ children }) => {
    const [audioContext, setAudioContext] = useState(null);
    const [oscillators, setOscillators] = useState([]);
    const [adsr, setADSR] = useState({ attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.5 });
    const [filterSettings, setFilterSettings] = useState({ cutoff: 20000, resonance: 1 });
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
    }, []);
    const calculateFrequency = (note, octave) => {
      const frequency = scale[note];
      if (!frequency) return null;
      return frequency * Math.pow(2, octave - baseOctave);
  };
    const [waveform, setWaveform] = useState('sine');

const createAndPlayOscillator = (freq) => {
    if (!audioContext) return; // Ensure the audio context is initialized

    const oscillator = audioContext.createOscillator();
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = filterSettings.cutoff;
    filterNode.Q.value = filterSettings.resonance;

    // Apply ADSR envelope to gain node
    const now = audioContext.currentTime;
    const attackEndTime = now + adsr.attack;
    const decayEndTime = attackEndTime + adsr.decay;
    const sustainStartTime = decayEndTime;
    const sustainValue = volume * adsr.sustain;

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, attackEndTime);
    gainNode.gain.linearRampToValueAtTime(sustainValue, decayEndTime);
    gainNode.gain.setValueAtTime(sustainValue, sustainStartTime); // Ensure sustain level is maintained

    oscillator.connect(filterNode).connect(gainNode).connect(audioContext.destination);
    oscillator.start();

    // Store oscillator info for management
    const oscillatorInfo = { oscillator, gainNode, filterNode, playing: true };
    setOscillators(prev => [...prev, oscillatorInfo]);

    return oscillatorInfo;
};
  

const stopOscillator = (oscillatorInfo) => {
  const { oscillator, gainNode } = oscillatorInfo;
  const now = audioContext.currentTime;

  // Explicitly set the current gain to the sustain level to ensure a smooth transition to release
  // This line seems to assume the gainNode's current value is at the sustain level, which should be correct if no external changes have been made.
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(gainNode.gain.value, now); // Start from the current gain value

  // Smoothly ramp the gain down to 0 over the release time
  // This should initiate the release phase correctly. Ensure the release time is not too short to notice.
  gainNode.gain.linearRampToValueAtTime(0, now + adsr.release);

  // Schedule the oscillator to stop after the release phase to ensure no abrupt cuts
  // Adding a slight buffer time (e.g., 0.1s) after the release ensures the oscillator stops smoothly without clipping.
  oscillator.stop(now + adsr.release + 0.1);

  // Once the oscillator has stopped, remove it from the active oscillators array to clean up resources
  oscillator.onended = () => {
    setOscillators((prevOscillators) => prevOscillators.filter((o) => o.oscillator !== oscillator));
  };
};


useEffect(() => {
  const testNote = () => {
    const noteFreq = calculateFrequency('A', 4); // Example note A4
    console.log("Playing note:", noteFreq);
    const oscillatorInfo = createAndPlayOscillator(noteFreq);

    // Log each phase to ensure correct timing
    console.log("Attack phase:", adsr.attack, "seconds");
    setTimeout(() => console.log("Decay to Sustain transition"), adsr.attack * 1000);
    // Wait for attack + decay before logging sustain maintenance
    setTimeout(() => console.log("Sustain phase, should maintain until stop"), (adsr.attack + adsr.decay) * 1000);

    // Stop after 2 seconds, ensuring we're in sustain phase
    setTimeout(() => {
      console.log("Stopping note");
      stopOscillator(oscillatorInfo);
    }, 2000); // Adjust this duration based on ADSR to ensure we reach sustain
  };

  if (audioContext) testNote();
}, [audioContext]); // Dependencies ensure this effect only runs once after the audio context is initialized


    return (
<SynthContext.Provider value={{
  audioContext,
  playNote: createAndPlayOscillator,
  stopNote: stopOscillator,
  setADSR,
  setVolume,
  setFilterSettings,
  adsr,
  volume,
  filterSettings,
  calculateFrequency,
  waveform,
  setWaveform,
  oscillators, // Make sure oscillators is included here
  setOscillators, // You may also want to provide a way to update oscillators
}}>
  {children}
</SynthContext.Provider>
    );
};