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
  onContinueEditing
}) {
  const [draggedColor, setDraggedColor] = useState(null);
  const [draggedFromSlot, setDraggedFromSlot] = useState(null);

  const handlePoolDragStart = (color) => {
    setDraggedColor(color);
    setDraggedFromSlot(null);
  };

  const handleSlotDragStart = (index) => {
    setDraggedColor(slots[index]);
    setDraggedFromSlot(index);
  };

  const handleSlotDrop = (index) => {
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
        <div className="progress-info">
          <span className="progress-text">{filledCount} / 24 colors placed</span>
          <button onClick={onReset} className="reset-btn">🔄 New Game</button>
        </div>
      </div>

      {/* Reference gradient */}
      <div className="reference-section">
        <div className="reference-label">Target Gradient:</div>
        <div className="reference-gradient">
          <ColorCircle color={startColor} size={40} />
          <div className="gradient-bar" style={{
            background: `linear-gradient(to right, ${startColor}, ${endColor})`
          }}></div>
          <ColorCircle color={endColor} size={40} />
        </div>
      </div>

      {/* Arrangement slots */}
      <div className="slots-section">
        <div className="section-label">Your Gradient:</div>
        <div className="slots-container">
          {slots.map((color, index) => (
            <div key={`slot-${index}`} className="slot-wrapper">
              <ColorCircle
                id={`slot-${index}`}
                color={color}
                isEmpty={color === null}
                size={50}
                draggable={color !== null}
                onDragStart={() => handleSlotDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleSlotDrop(index)}
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
      </div>

      {/* Color pool */}
      <div className="pool-section">
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
              draggable={true}
              onDragStart={() => handlePoolDragStart(color)}
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
