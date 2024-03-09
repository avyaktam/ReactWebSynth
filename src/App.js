//app.js
import './App.css';
import React, { useState, useEffect } from 'react';
import Keyboard from './keyboard'; // Import the Keyboard component

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

  const playNote = (noteWithOctave, duration = 0.5, type = 'sine') => {
    const notePattern = /([A-G]#?)(\d+)/;
    const match = noteWithOctave.match(notePattern);
    if (!match) {
      console.error('Invalid note format:', noteWithOctave);
      return;
    }
    const [, note, octave] = match;
    const freq = calculateFrequency(note, parseInt(octave, 10));
    if (!freq) {
      console.error('Note not found in scale:', noteWithOctave);
      return;
    }
    const oscillator = createOscillator(freq, type);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  };

  const calculateFrequency = (note, octave) => {
    // Use the base octave to calculate the frequency of the note in the target octave
    const frequency = scale[note];
    if (!frequency) return null;
    return frequency * Math.pow(2, octave - baseOctave);
  };

return (
  <div className="App">
    <header className="App-header">
      <Keyboard playNote={playNote} scale={scale} />
    </header>
  </div>
);}

export default App;
