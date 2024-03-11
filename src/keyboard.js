import React, { useState, useEffect } from 'react';
import { useSynthContext } from './SynthContext';

function Keyboard() {
    const { playNote, stopNote, calculateFrequency } = useSynthContext();
    const [currentOctave, setCurrentOctave] = useState(4);
    const [activeKeys, setActiveKeys] = useState({});
    const [isMouseDown, setIsMouseDown] = useState(false);

    const keyToNote = {
      'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
      'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A',
      'u': 'A#', 'j': 'B',
      'k': 'C', 'o': 'C#', 'l': 'D', 'p': 'D#', 'ö': 'E', 'ä': 'F', 'å': 'F#'
    };

    const handleKeyPress = (key, isDown) => {
      const note = keyToNote[key];
      if (!note) return;
  
      const octaveAdjustment = ['k', 'o', 'l', 'p', 'ö', 'ä', 'å'].includes(key) ? 1 : 0;
      const effectiveOctave = currentOctave + octaveAdjustment;
  
      if (isDown) {
          const freq = calculateFrequency(note, effectiveOctave);
          if (freq) {
              const oscillatorInfo = playNote(freq, 'sine'); // Assuming 'sine' is default or consider removing if not needed
              setActiveKeys(prev => ({ ...prev, [key]: oscillatorInfo }));
          }
      } else {
          const oscillatorInfo = activeKeys[key];
          if (oscillatorInfo) {
              stopNote(oscillatorInfo);
              setActiveKeys(prev => {
                  const newKeys = { ...prev };
                  delete newKeys[key];
                  return newKeys;
              });
          }
      }
  };
  

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!activeKeys[event.key] && keyToNote[event.key]) {
                handleKeyPress(event.key, true);
            } else if (event.key === 'z' && currentOctave > 0) {
                setCurrentOctave(prev => prev - 1); // Decrease octave
            } else if (event.key === 'x' && currentOctave < 8) {
                setCurrentOctave(prev => prev + 1); // Increase octave
            }
        };

        const handleKeyUp = (event) => {
            if (activeKeys[event.key]) {
                handleKeyPress(event.key, false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [currentOctave, activeKeys, playNote, stopNote, calculateFrequency]);
    const handleTouchStart = (event) => {
      setIsMouseDown(true); // Consider touch as mouse down
      handleTouch(event);
  };

  const handleTouchMove = (event) => {
      handleTouch(event);
  };

  const handleTouchEnd = () => {
      setIsMouseDown(false); // Reset on touch end
      Object.keys(activeKeys).forEach(key => {
          handleKeyPress(key, false); // Release all keys
      });
  };

  const handleTouch = (event) => {
      event.preventDefault(); // Prevent scrolling
      const touches = event.changedTouches;
      for (let i = 0; i < touches.length; i++) {
          const touch = touches[i];
          const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
          const key = targetElement && targetElement.getAttribute("data-key");
          if (key && !activeKeys[key]) { // Prevent re-triggering the same key
              handleKeyPress(key, true);
          }
      }
  };
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
