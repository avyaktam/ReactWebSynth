//keyboard.js
import React, { useState, useEffect } from 'react';

function Keyboard({ playNote }) {
  const [currentOctave, setCurrentOctave] = useState(4);
  const [activeKeys, setActiveKeys] = useState({});
  const [isMouseDown, setIsMouseDown] = useState(false);
  // Adjusted key mapping to reflect the musical scale correctly
  const keyToNote = {
    'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
    'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A',
    'u': 'A#', 'j': 'B', // Up to here, it's the 4th octave
    // Starting from 'k', we move to the 5th octave
    'k': 'C', 'o': 'C#', 'l': 'D', 'p': 'D#', 'ö': 'E', 'ä': 'F', 'å': 'F#'
  };

  const handleKeyPress = (key, isDown) => {
    if (key === 'z' && isDown) {
      setCurrentOctave(Math.max(1, currentOctave - 1)); // Decrease octave
      return;
    } else if (key === 'x' && isDown) {
      setCurrentOctave(Math.min(8, currentOctave + 1)); // Increase octave
      return;
    }
  
    const note = keyToNote[key];
    if (note) {
      // Determine the correct octave for the note based on its position in the sequence.
      const keysOrder = "awsefdtgjhyuikolpöä¨"; // Represents the full sequence of keys
      const index = keysOrder.indexOf(key);
      const octaveAdjustment = Math.floor(index / 12); // Adjust octave every 12 keys.
      const noteWithOctave = `${note}${currentOctave + octaveAdjustment}`;
  
      setActiveKeys((prev) => ({ ...prev, [key]: isDown }));
      if (isDown) {
        playNote(noteWithOctave);
      }
    }
  };
  

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!activeKeys[event.key]) handleKeyPress(event.key, true);
    };

    const handleKeyUp = (event) => {
      if (activeKeys[event.key]) handleKeyPress(event.key, false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentOctave, activeKeys]);

  return (
    <div className="keyboard">
      {Object.entries(keyToNote).map(([key, value]) => {
        const isActive = !!activeKeys[key];
        const note = value + currentOctave;
        return (
          <div
          key={key}
          className={`key ${value.includes('#') ? 'black' : 'white'} ${isActive ? 'active' : ''}`}
          onMouseDown={() => { handleKeyPress(key, true); setIsMouseDown(true); }}
          onMouseUp={() => { handleKeyPress(key, false); setIsMouseDown(false); }}
          onMouseEnter={() => isMouseDown && handleKeyPress(key, true)}
          onMouseLeave={() => handleKeyPress(key, false)}
          onTouchStart={() => handleKeyPress(key, true)} // Handle touch start
        >
            {/* Note name */}
            <div className="note-name">
              {note}
            </div>
          </div>
        );
      })}
    </div>
  );
  
}

export default Keyboard;
