import React, { useState, useEffect, useRef } from 'react';
import './customselect.css';
import LabelIcon from '@mui/icons-material/Label';

const CustomSelect = ({ selectedTags = [], onSelectTags = () => {} }) => {
    const options = ['High', 'Medium', 'Low'];
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };

    const handleSelectTag = (tag) => {
      if (selectedTags.includes(tag)) {
        onSelectTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
      } else {
        onSelectTags([...selectedTags, tag]);
      }
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
                  {tag}
                  <span className="remove-tag" onClick={() => handleSelectTag(tag)}>
                    &#x2716;
                  </span>
                </div>
              ))
            :  <LabelIcon  className="label-icon" style={{ fontSize: 30 }} />}

        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            {options.map((option, index) => (
              <div
                key={index}
                className={`dropdown-item ${
                  selectedTags.includes(option) ? 'selected' : ''
                }`}
                onClick={() => handleSelectTag(option)}
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
