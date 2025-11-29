import React from 'react';

const BoardTabs = ({ boards, activeBoard, onSelect }) => {
  return (
    <div className="board-tabs-container">
      {boards.map((board) => (
        <button
          key={board}
          className={`board-tab ${activeBoard === board ? 'active' : ''}`}
          onClick={() => onSelect(board)}
        >
          {board}
        </button>
      ))}
    </div>
  );
};

export default BoardTabs;
