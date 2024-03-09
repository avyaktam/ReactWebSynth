// In AttackSlider.js
import React from 'react';

function AttackSlider({ attack, setAttack }) {
  return (
    <div>
      <label htmlFor="attack">Attack Time: {attack}</label>
      <input
        type="range"
        id="attack"
        min="0"
        max="1"
        step="0.01"
        value={attack}
        onChange={(e) => setAttack(parseFloat(e.target.value))}
      />
    </div>
  );
}

export default AttackSlider;
