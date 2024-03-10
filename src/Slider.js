// Slider.js
import React from 'react';
import './Slider.css'; // Assuming you have a CSS file for Slider styles

function Slider({ label, value, onChange, min, max, step }) {
  return (
    <div className="slider-wrapper">
      <div className="slider-label">
        <label htmlFor={label}>{`${label.charAt(0).toUpperCase() + label.slice(1)}: ${value}`}</label>
      </div>
      <div className="slider-control">
        <input
          type="range"
          id={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="slider"
        />
      </div>
    </div>
  );
}

export default Slider;
