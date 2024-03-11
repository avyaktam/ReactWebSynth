import React, { useRef, useEffect } from 'react';

const ADSREnvelopeVisualizer = ({ adsr }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate the positions on the canvas
    const attackEndX = adsr.attack * width;
    const decayEndX = attackEndX + (adsr.decay * width);
    const sustainEndX = decayEndX; // Sustain does not have a duration, it's a level
    const releaseEndX = sustainEndX + (adsr.release * width); // Release phase width

    // Calculate the height positions on the canvas
    const peakLevelY = 0;
    const sustainLevelY = (1 - adsr.sustain) * height;
    const baseLevelY = height;
    
    // Draw the ADSR envelope
    ctx.beginPath();
    ctx.moveTo(0, baseLevelY); // Start at the bottom left
    ctx.lineTo(attackEndX, peakLevelY); // Attack to peak
    ctx.lineTo(decayEndX, sustainLevelY); // Decay to sustain level
    ctx.fillStyle = '#000'; // Black background for the box
    ctx.strokeStyle = '#FFF'; // White color for the ADSR line
    ctx.lineWidth = 2; // Line width for the ADSR line
    ctx.fillRect(0, 0, width, height); 
    ctx.stroke(); 
    // Sustain phase is horizontal, so no need for an additional line

    if (releaseEndX <= width) {
      // If releaseEndX is within the canvas, draw the release phase
      ctx.lineTo(releaseEndX, baseLevelY); // Release to bottom
    } else {
      // If the release goes beyond the canvas, draw to the edge
      ctx.lineTo(width, baseLevelY); // Release to right edge
    }
    
    ctx.stroke(); // Stroke the path
  }, [adsr]); // Redraw when ADSR values change

  return <canvas ref={canvasRef} width="200" height="100" />;
};

export default ADSREnvelopeVisualizer;
