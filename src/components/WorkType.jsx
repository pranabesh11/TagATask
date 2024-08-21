import React, { useState, useEffect, useRef } from 'react';
import './worktype.css';
import icon from '../assets/infinite.png';
import workflowIcon from '../assets/workflow.png';

const DropdownSelector = () => {
  const options = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Annually', 'WorkFlow'];
  const [selectedOption, setSelectedOption] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const handleIconClick = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-selector" ref={dropdownRef}>
      <div className="icon-container" onClick={handleIconClick}>
        <img
          src={selectedOption === 'WorkFlow' ? workflowIcon : icon}
          alt="dropdown icon"
          className="dropdown-icon"
        />
        {selectedOption && (
          <span className="selected-value">{selectedOption}</span>
        )}
      </div>

      {showOptions && (
        <div className="options-popup">
          {options.map((option, index) => (
            <div key={index} className="option-item" onClick={() => handleOptionSelect(option)}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSelector;
