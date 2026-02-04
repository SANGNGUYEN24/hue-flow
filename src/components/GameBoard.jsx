import { useState } from 'react';
import ColorCircle from './ColorCircle';
import './GameBoard.css';

function GameBoard({ 
  colorPool, 
  slots, 
  onColorPlace, 
  onColorRemove,
  onSlotSwap,
  startColor, 
  endColor,
  onReset,
  correctGradient,
  isValidating,
  onCheckAnswer,
  onContinueEditing,
  timeRemaining
}) {
  const [draggedColor, setDraggedColor] = useState(null);
  const [draggedFromSlot, setDraggedFromSlot] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null); // For click-to-place
  const [selectedFromSlot, setSelectedFromSlot] = useState(null); // Track if selected from slot

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Click handlers for mobile
  const handleColorClick = (color) => {
    if (timeRemaining === 0) return;
    
    // Find the next empty slot
    const nextEmptySlotIndex = slots.findIndex(slot => slot === null);
    
    if (nextEmptySlotIndex !== -1) {
      // Auto-place color in the next empty slot
      onColorPlace(color, nextEmptySlotIndex);
    } else {
      // If no empty slots, just select the color for manual placement
      setSelectedColor(color);
      setSelectedFromSlot(null);
    }
  };

  const handleSlotClick = (index) => {
    if (timeRemaining === 0) return;
    
    if (selectedColor !== null) {
      // Place selected color into slot
      if (selectedFromSlot !== null) {
        // Moving from slot to slot
        onSlotSwap(selectedFromSlot, index);
      } else {
        // Placing from pool to slot
        onColorPlace(selectedColor, index);
      }
      setSelectedColor(null);
      setSelectedFromSlot(null);
    } else if (slots[index] !== null) {
      // Select color from slot
      setSelectedColor(slots[index]);
      setSelectedFromSlot(index);
    }
  };

  const handlePoolClick = () => {
    if (timeRemaining === 0) return;
    
    if (selectedFromSlot !== null) {
      // Return color from slot to pool
      onColorRemove(selectedFromSlot);
      setSelectedColor(null);
      setSelectedFromSlot(null);
    }
  };

  // Drag handlers (keep for desktop)
  const handlePoolDragStart = (color) => {
    if (timeRemaining === 0) return; // Prevent dragging when time is up
    setDraggedColor(color);
    setDraggedFromSlot(null);
  };

  const handleSlotDragStart = (index) => {
    if (timeRemaining === 0) return; // Prevent dragging when time is up
    setDraggedColor(slots[index]);
    setDraggedFromSlot(index);
  };

  const handleSlotDrop = (index) => {
    if (timeRemaining === 0) return; // Prevent dropping when time is up
    if (draggedColor) {
      if (draggedFromSlot !== null) {
        // Swapping/moving between slots
        onSlotSwap(draggedFromSlot, index);
      } else {
        // Placing from pool to slot
        onColorPlace(draggedColor, index);
      }
      setDraggedColor(null);
      setDraggedFromSlot(null);
    }
  };

  const handlePoolDrop = () => {
    if (timeRemaining === 0) return; // Prevent dropping when time is up
    if (draggedFromSlot !== null) {
      // Returning color from slot to pool
      onColorRemove(draggedFromSlot);
      setDraggedColor(null);
      setDraggedFromSlot(null);
    }
  };

  const filledCount = slots.filter(slot => slot !== null).length;
  const isComplete = filledCount === 24;

  // Check which slots are correct
  const slotStatus = slots.map((color, index) => {
    if (!isValidating || color === null) return null;
    return color === correctGradient[index] ? 'correct' : 'incorrect';
  });

  const correctCount = slotStatus.filter(status => status === 'correct').length;

  return (
    <div className="game-board">
      <div className="game-header">
        <h2 className="board-title">Arrange the Colors</h2>
        <div className="timer-display">
          <span className={`timer ${timeRemaining <= 10 ? 'timer-warning' : ''} ${timeRemaining === 0 ? 'timer-expired' : ''}`}>
            ⏱️ {formatTime(timeRemaining)}
          </span>
        </div>
        <div className="progress-info">
          <span className="progress-text">{filledCount} / 24 colors placed</span>
          <button onClick={onReset} className="reset-btn">🔄 New Game</button>
        </div>
      </div>

      {/* Landscape orientation hint for mobile */}
      <div className="orientation-hint">
        📱 Tip: Rotate your device to landscape mode for better experience!
      </div>

      {/* Arrangement slots */}
      <div className="slots-section">
        <div className="section-header">
          <div className="section-label">Your Gradient:</div>
          <div className="color-indicators">
            <div className="color-indicator">
              <ColorCircle color={startColor} size={35} draggable={false} />
              <span className="color-label">Start</span>
            </div>
            <div className="arrow-indicator">→</div>
            <div className="color-indicator">
              <ColorCircle color={endColor} size={35} draggable={false} />
              <span className="color-label">End</span>
            </div>
          </div>
        </div>
        <div className="slots-container">
          {slots.map((color, index) => (
            <div 
              key={`slot-${index}`} 
              className={`slot-wrapper ${selectedFromSlot === index ? 'selected' : ''}`}
            >
              <ColorCircle
                id={`slot-${index}`}
                color={color}
                isEmpty={color === null}
                size={50}
                draggable={color !== null && timeRemaining > 0}
                onDragStart={() => handleSlotDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleSlotDrop(index)}
                onClick={() => handleSlotClick(index)}
                isSelected={selectedFromSlot === index}
              />
              {isValidating && slotStatus[index] && (
                <div className={`validation-indicator ${slotStatus[index]}`}>
                  {slotStatus[index] === 'correct' ? '✓' : '✗'}
                </div>
              )}
            </div>
          ))}
        </div>
        {isComplete && !isValidating && (
          <button onClick={onCheckAnswer} className="check-btn">
            Check My Answer 🎯
          </button>
        )}
        {isValidating && (
          <div className="validation-result">
            <strong>{correctCount} out of 24</strong> colors are in the correct position!
            {correctCount === 24 && <span className="perfect"> 🎉 Perfect!</span>}
            {correctCount < 24 && (
              <button onClick={onContinueEditing} className="continue-btn">
                ✏️ Continue Editing
              </button>
            )}
          </div>
        )}
        {timeRemaining === 0 && !isValidating && (
          <div className="time-up-message">
            ⏰ Time's Up!
          </div>
        )}
      </div>

      {/* Color pool */}
      <div className="pool-section" onClick={handlePoolClick}>
        <div className="section-label">Available Colors:</div>
        <div 
          className="color-pool"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handlePoolDrop}
        >
          {colorPool.map((color, index) => (
            <ColorCircle
              key={`pool-${index}-${color}`}
              id={`pool-${index}`}
              color={color}
              size={50}
              draggable={timeRemaining > 0}
              onDragStart={() => handlePoolDragStart(color)}
              onClick={() => handleColorClick(color)}
              isSelected={selectedColor === color && selectedFromSlot === null}
            />
          ))}
        </div>
      </div>

      {isComplete && (
        <div className="completion-message">
          🎉 All colors placed! How does your gradient look?
        </div>
      )}
    </div>
  );
}

export default GameBoard;
