import './ColorPicker.css';

function ColorPicker({ 
  startColor, 
  endColor, 
  onStartColorChange, 
  onEndColorChange, 
  onRandomStart, 
  onRandomEnd, 
  onConfirm 
}) {
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

      <button onClick={onConfirm} className="confirm-btn">
        Start Game ✨
      </button>
    </div>
  );
}

export default ColorPicker;
