import './ColorCircle.css';

function ColorCircle({ 
  color, 
  draggable = false, 
  onDragStart, 
  onDragEnd,
  onDragOver,
  onDrop,
  isEmpty = false,
  size = 50,
  id
}) {
  const handleDragStart = (e) => {
    if (onDragStart) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.target);
      onDragStart(e);
    }
  };

  const handleDragOver = (e) => {
    if (onDragOver) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      onDragOver(e);
    }
  };

  const handleDrop = (e) => {
    if (onDrop) {
      e.preventDefault();
      onDrop(e);
    }
  };

  return (
    <div
      id={id}
      className={`color-circle ${isEmpty ? 'empty' : ''} ${draggable ? 'draggable' : ''}`}
      style={{
        backgroundColor: isEmpty ? 'transparent' : color,
        width: `${size}px`,
        height: `${size}px`,
      }}
      draggable={draggable && !isEmpty}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isEmpty && <div className="empty-indicator">+</div>}
    </div>
  );
}

export default ColorCircle;
