import React, { useState, useEffect, useRef } from "react";
import { fetchTagsByUserId, sendTagsByUserId  } from "../components/ApiList";
import "./customselect.css";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const CustomSelect = ({ taskPriorityId , sendCustomTags ,index }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [tagOptions, setTagOptions] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("Updated selected tags:------------------->", selectedTags);
  }, [selectedTags]);

  const handleToggleDropdown = async (event) => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      const all_tags = await fetchTagsByUserId();
      console.log("these are all tags",all_tags);
      setTagOptions(all_tags);
      setFilteredTags(all_tags);
    }
  };

  const handleSelectTag = async (tag, event) => {
    event.stopPropagation();
    setDropdownOpen(false);
    sendCustomTags(tag , index);
    if (selectedTags.some(selected => selected[0] === tag[0])) {
      setSelectedTags(selectedTags.filter((selected) => selected[0] !== tag[0]));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    await sendTagsByUserId(taskPriorityId, tag[0],tag[1]);
    setSearchTerm("");
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleSearch = async(event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    const filtered = tagOptions.filter((tag) =>
      tag[1].toLowerCase().includes(query)
    );
    setFilteredTags(filtered);
  };

  
  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!searchTerm.trim()) return;
      if (!selectedTags.some((tag) => tag[1].toLowerCase() === searchTerm.toLowerCase())) {
        const temp_id = Date.now();
        const tagObject = [temp_id, searchTerm];
        console.log("🔹 New Tag Object (Immediate):", tagObject , taskPriorityId);
        setSelectedTags((prevTags) => [...prevTags, tagObject]);
        sendCustomTags(tagObject , index)
        await sendTagsByUserId(taskPriorityId, null, searchTerm);
      }
      setSearchTerm("");
    }
  };
  
  

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={handleToggleDropdown}>
        {selectedTags.length > 0 ? (
          selectedTags.map((tag, index) => (
            <div key={index} className="selected-tag">
              <Tooltip id="tagname" />
              <p
                className="tagName"
                data-tooltip-id="tagname"
                data-tooltip-content={tag[1]}
                data-tooltip-place="top"
              >
                {tag[1]}
              </p>
              <span className="remove-tag" onClick={(e) => handleSelectTag(tag, e)}>
                &#x2716;
              </span>
            </div>
          ))
        ) : (
          <LabelOutlinedIcon style={{ fontSize: 30, color: "#b2b2b2" }} />
        )}
      </div>

      {dropdownOpen && (
        <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
          {/* Search Bar */}
          <input
            type="text"
            className="search-bar"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
          />

          {/* Filtered Dropdown Options */}
          {console.log("this is tag options",filteredTags)}
          {filteredTags && filteredTags.length > 0 ? (
            filteredTags.map((option, index) => (
              <div 
              key={index}
              onClick={(e) => handleSelectTag(option, e)}
              className="option-value"
              >
                {option[1]}
              </div>
            ))
          ) : (
            <div className="no-results">No tags found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
