import React from 'react';

const StandardTabs = ({ standards, activeStandard, onSelect }) => {
  return (
    <div className="standard-tabs-container">
      {standards.map((std) => (
        <button
          key={std.id}
          className={`standard-tab ${activeStandard === std.id ? 'active' : ''}`}
          onClick={() => onSelect(std.id)}
        >
          {std.label}
        </button>
      ))}
    </div>
  );
};

export default StandardTabs;
