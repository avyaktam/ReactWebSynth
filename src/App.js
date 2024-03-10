import React, { useState, useEffect } from 'react';
import Keyboard from './keyboard'; // Ensure this path matches your file structure
import Slider from './Slider'; // Ensure this is correctly imported
import './App.css'; 
// Define the base octave for calculation purposes
const baseOctave = 4;


// Note frequencies for the 4th octave (C4 to B4) as the base
const scale = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88,
};

function App() {
  const [audioContext, setAudioContext] = useState(null);

  const [attack, setAttack] = useState(0.1); // Example initial value
  const [decay, setDecay] = useState(0.1);
  const [sustain, setSustain] = useState(0.5);
  const [release, setRelease] = useState(0.5);
  const [volume, setVolume] = useState(0.5); // Range 0 to 1
  
  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
  }, []);

  const createOscillator = (freq, type = 'sine') => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    return oscillator;
  };

  const playNote = (noteWithOctave, type = 'sine') => {
    const notePattern = /([A-G]#?)(\d+)/;
    const match = noteWithOctave.match(notePattern);
    if (!match) return;
  
    const [, note, octave] = match;
    const freq = calculateFrequency(note, parseInt(octave, 10));
    if (!freq) return;
  
    const oscillator = audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
  
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
  
    // Implement ADSR envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + attack);
    gainNode.gain.linearRampToValueAtTime(sustain * volume, audioContext.currentTime + attack + decay);
    
    oscillator.start();
  
    // Release
    setTimeout(() => {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + release);
      oscillator.stop(audioContext.currentTime + release); // Stop oscillator after release
    }, (attack + decay) * 1000); // Convert seconds to milliseconds for setTimeout
  };
  
  const releaseNote = (noteWithOctave) => {
    // Implement releaseNote functionality here
    console.log('Note released:', noteWithOctave);
  };

  const calculateFrequency = (note, octave) => {
    // Use the base octave to calculate the frequency of the note in the target octave
    const frequency = scale[note];
    if (!frequency) return null;
    return frequency * Math.pow(2, octave - baseOctave);
  };

// In App component
return (
  <div className="App">
    <header className="App-header">
      {/* Make sure to import Slider correctly and define it as shown previously */}
      <Slider label="attack" value={attack} onChange={(e) => setAttack(parseFloat(e.target.value))} min="0" max="1" step="0.01" />
      <Slider label="decay" value={decay} onChange={(e) => setDecay(parseFloat(e.target.value))} min="0" max="1" step="0.01" />
      <Slider label="sustain" value={sustain} onChange={(e) => setSustain(parseFloat(e.target.value))} min="0" max="1" step="0.01" />
      <Slider label="release" value={release} onChange={(e) => setRelease(parseFloat(e.target.value))} min="0" max="1" step="0.01" />
      <Slider label="volume" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} min="0" max="1" step="0.01" />
      <Keyboard playNote={playNote} releaseNote={releaseNote} scale={scale} />
    </header>
  </div>
);
}

export default App;
