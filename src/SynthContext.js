//SynthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const createAndPlayOscillator = (freq, type = 'sine') => {
        if (!audioContext) return; // Ensure the audio context is initialized

        const oscillator = audioContext.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

        const gainNode = audioContext.createGain();
        const filterNode = audioContext.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.frequency.value = filterSettings.cutoff;
        filterNode.Q.value = filterSettings.resonance;

        // Apply ADSR envelope to gain node
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + adsr.attack);
        gainNode.gain.linearRampToValueAtTime(volume * adsr.sustain, now + adsr.attack + adsr.decay);

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
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now); // Use current gain value
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + adsr.release);
        oscillator.stop(now + adsr.release);
        
        oscillator.onended = () => {
            setOscillators(prev => prev.filter(o => o !== oscillatorInfo));
        };
    };

    useEffect(() => {
        // This effect ensures that the ADSR and filter settings are applied to new oscillators.
        // However, it's mostly beneficial for existing oscillators if their settings should be dynamically updated,
        // which might not be straightforward for ADSR as it's applied at note start.
    }, [adsr, filterSettings, volume]);

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
            calculateFrequency
        }}>
            {children}
        </SynthContext.Provider>
    );
};