import React, { useState, useEffect } from 'react';
import ADSRControls from './ADSRControls';
import FilterControls from './FilterControls';
// Add imports for any other modules you have

const moduleComponents = {
  'ADSR': ADSRControls,
  'Filter': FilterControls,
  // Add other modules here
};

function Display() {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const modules = Object.keys(moduleComponents);

  const cycleModule = (direction) => {
    setCurrentModuleIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) {
        return modules.length - 1; // Cycle back to the last module
      } else if (newIndex >= modules.length) {
        return 0; // Cycle back to the first module
      }
      return newIndex;
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      cycleModule(-1);
    } else if (event.key === 'ArrowRight') {
      cycleModule(1);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const CurrentModule = moduleComponents[modules[currentModuleIndex]];

  return (
    <div className="display-container">
      <CurrentModule />
    </div>
  );
}

export default Display;
