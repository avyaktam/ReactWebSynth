// FilterControls.js
import React from 'react';

const FilterControls = ({ filterSettings, setFilterSettings }) => {
  // Handle change for each filter parameter
  const handleChange = (param, value) => {
    setFilterSettings({ ...filterSettings, [param]: parseFloat(value) });
  };

  return (
    <div className="filter-controls">
      <label>
        Cutoff:
        <input
          type="range"
          min="20"
          max="20000"
          step="1"
          value={filterSettings.cutoff}
          onChange={(e) => handleChange('cutoff', e.target.value)}
        />
        {filterSettings.cutoff} Hz
      </label>
      <label>
        Resonance:
        <input
          type="range"
          min="0.01"
          max="20"
          step="0.01"
          value={filterSettings.resonance}
          onChange={(e) => handleChange('resonance', e.target.value)}
        />
        {filterSettings.resonance}
      </label>
      {/* Add other filter parameters as needed */}
    </div>
  );
};

export default FilterControls;
