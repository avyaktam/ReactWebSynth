import React, { useRef, useEffect } from 'react';

const ADSREnvelopeVisualizer = ({ adsr }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Constants for maximum values of ADSR parameters for scaling purposes
    const maxAttack = 5; // Adjust these max values based on your UI control ranges
    const maxDecay = 5;
    const maxRelease = 5;
    const maxSustain = 5; // Sustain is a level (0-1), not a time

    ctx.clearRect(0, 0, width, height); // Clear the canvas

    // Normalize the ADSR parameters to the canvas size
    const normalizedAttackWidth = (adsr.attack / maxAttack) * width * 0.25; // Assign 25% of width to Attack phase for visual emphasis
    const normalizedDecayWidth = (adsr.decay / maxDecay) * width * 0.25; // Assign 25% of width to Decay phase for visual emphasis
    // For Sustain, we're showing it as a level, not duration, but it visually occupies part of the canvas
    const sustainHeight = height * (1 - adsr.sustain / maxSustain); // Inverting since canvas's 0 is at the top
    const normalizedReleaseWidth = (adsr.release / maxRelease) * width * 0.5; // Assign 25% of width to Release phase for visual emphasis
    const sustainWidth = width - (normalizedAttackWidth + normalizedDecayWidth + normalizedReleaseWidth); // Remaining width

    // Drawing the ADSR envelope
    ctx.beginPath();
    ctx.moveTo(0, height); // Start from bottom left
    ctx.lineTo(normalizedAttackWidth, 0); // Attack rises to the peak
    const decayEndX = normalizedAttackWidth + normalizedDecayWidth;
    ctx.lineTo(decayEndX, sustainHeight); // Decay drops to sustain level
    const sustainEndX = decayEndX + sustainWidth;
    ctx.lineTo(sustainEndX, sustainHeight); // Sustain holds the level
    ctx.lineTo(width, height); // Release drops back to the bottom

    // Styling the envelope
    ctx.strokeStyle = 'rgb(0, 123, 255)'; // Choose a visible color for the stroke
    ctx.lineWidth = 2; // Set line width
    ctx.stroke(); // Apply stroke

    // Optional: Fill under the envelope for a visual effect
    ctx.fillStyle = 'rgba(0, 123, 255, 0.1)'; // Light fill color under the envelope
    ctx.fill(); // Apply fill
  }, [adsr]); // Redraw when ADSR values change

  return <canvas ref={canvasRef} width="200" height="100"></canvas>;
};

export default ADSREnvelopeVisualizer;
