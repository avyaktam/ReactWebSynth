import React from 'react';
import { SynthProvider } from './SynthContext';
import Keyboard from './Keyboard';
import Display from './Display'; // Assuming you have this component set up
import './App.css';

function App() {
  return (
    <SynthProvider>
      <div className="App">
        <header className="App-header">
          <Display /> {/* This will show your ADSR controls and visualizer */}
          <Keyboard />
        </header>
      </div>
    </SynthProvider>
  );
}

export default App;