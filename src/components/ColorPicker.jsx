import { useState, useEffect } from 'react';
import './ColorPicker.css';

function ColorPicker({ 
  startColor, 
  endColor, 
  onStartColorChange, 
  onEndColorChange, 
  onRandomStart, 
  onRandomEnd, 
  onConfirm,
  timeLimit,
  onTimeLimitChange
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartValue, setDragStartValue] = useState(0);

  const MIN_TIME = 60;  // 1 minute
  const MAX_TIME = 300; // 5 minutes
  const STEP = 30;      // 30 seconds step

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const snapToStep = (value) => {
    // Round to nearest 30-second step
    return Math.round(value / STEP) * STEP;
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartValue(timeLimit);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX;
    // Each 20 pixels = 30 seconds (one step)
    const deltaSteps = Math.round(deltaX / 20);
    const newValue = dragStartValue + (deltaSteps * STEP);
    
    // Clamp to min/max and snap to step
    const clampedValue = Math.max(MIN_TIME, Math.min(MAX_TIME, newValue));
    const snappedValue = snapToStep(clampedValue);
    
    onTimeLimitChange(snappedValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragStartValue(timeLimit);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - dragStartX;
    const deltaSteps = Math.round(deltaX / 20);
    const newValue = dragStartValue + (deltaSteps * STEP);
    
    const clampedValue = Math.max(MIN_TIME, Math.min(MAX_TIME, newValue));
    const snappedValue = snapToStep(clampedValue);
    
    onTimeLimitChange(snappedValue);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="color-picker-container">
      <h1 className="game-title">🎨 Hue Flow</h1>
      <p className="game-subtitle">Create the perfect gradient</p>
      
      <div className="color-selection">
        <div className="color-input-group">
          <label>Start Color</label>
          <div className="color-preview" style={{ backgroundColor: startColor }}></div>
          <input 
            type="color" 
            value={startColor} 
            onChange={(e) => onStartColorChange(e.target.value)}
            className="color-input"
          />
          <button onClick={onRandomStart} className="random-btn">
            🎲 Random
          </button>
        </div>

        <div className="arrow">→</div>

        <div className="color-input-group">
          <label>End Color</label>
          <div className="color-preview" style={{ backgroundColor: endColor }}></div>
          <input 
            type="color" 
            value={endColor} 
            onChange={(e) => onEndColorChange(e.target.value)}
            className="color-input"
          />
          <button onClick={onRandomEnd} className="random-btn">
            🎲 Random
          </button>
        </div>
      </div>

      <div className="timer-setting">
        <label>⏱️ Time Limit</label>
        <div 
          className={`time-spinner ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="spinner-arrow left">◀</div>
          <div className="time-display-large">{formatTime(timeLimit)}</div>
          <div className="spinner-arrow right">▶</div>
          <div className="spinner-hint">← Drag to adjust →</div>
        </div>
        <div className="time-range-indicator">
          <span>1m</span>
          <div className="range-bar">
            <div 
              className="range-fill" 
              style={{ width: `${((timeLimit - MIN_TIME) / (MAX_TIME - MIN_TIME)) * 100}%` }}
            ></div>
            {/* Step markers for each 30-second interval */}
            {[60, 90, 120, 150, 180, 210, 240, 270, 300].map((time) => (
              <div 
                key={time}
                className={`step-marker ${timeLimit === time ? 'active' : ''}`}
                style={{ left: `${((time - MIN_TIME) / (MAX_TIME - MIN_TIME)) * 100}%` }}
              />
            ))}
          </div>
          <span>5m</span>
        </div>
      </div>

      <button onClick={onConfirm} className="confirm-btn">
        Start Game ✨
      </button>
    </div>
  );
}

export default ColorPicker;
