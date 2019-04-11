import React from 'react';

const Tooltip = ({
  visible, 
  title, 
  content, 
  x, 
  y, 
  above,
  left,
  offset = {x: 0, y:0}
}) => {
  const xPos = left ?
    `calc(-115% + ${x + offset.x}px)` :
    `calc(15% + ${x + offset.x}px)`;
  const yPos = above ?
    `calc(-133% + ${y + offset.y}px)` :
    `calc(33% + ${y + offset.y}px)`
  return visible && 
  (
    <div 
      className="tooltip" 
      style={{ 
        transform: `translate(${xPos}, ${yPos})` 
      }}>
      <div className="tooltip__title">{title}</div>
      <div className="tooltip__content">
        {content}
      </div>
    </div>
  )
}


export default Tooltip;