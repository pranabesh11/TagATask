import React, { useState, useEffect, useRef } from 'react';
import './customselect.css';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const CustomSelect = ({ selectedTags = [], onSelectTags = () => {}, tagoption }) => {
  const options = tagoption;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggleDropdown = (event) => {
    event.stopPropagation(); // Prevent event from propagating to the document
    setDropdownOpen(!dropdownOpen);
    console.log("Dropdown toggled");
  };

  const handleSelectTag = (tag, event) => {
    event.stopPropagation(); // Prevent event bubbling when selecting a tag

    if (selectedTags.includes(tag)) {
      onSelectTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      onSelectTags([...selectedTags, tag]);
    }

    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={handleToggleDropdown}>
        {selectedTags.length > 0
          ? selectedTags.map((tag, index) => (
              <div key={index} className={`selected-tag ${tag.toLowerCase()}`}>
                <Tooltip id="tagname" />
                <p
                  className="tagName"
                  data-tooltip-id={`tagname`}
                  data-tooltip-content={tag}
                  data-tooltip-place="top"
                >
                  {tag}
                </p>
                <span
                  className="remove-tag"
                  onClick={(e) => handleSelectTag(tag, e)} // Pass the event to stop propagation
                >
                  &#x2716;
                </span>
              </div>
            ))
          : <LabelOutlinedIcon style={{ fontSize: 30, color: '#b2b2b2' }} />}
      </div>
      {dropdownOpen && (
        <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}> {/* Stop bubbling */}
          {options.map((option, index) => (
            <div
              key={index}
              className={`dropdown-item ${
                selectedTags.includes(option) ? 'selected' : ''
              }`}
              onClick={(e) => handleSelectTag(option, e)} // Pass the event to stop propagation
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
