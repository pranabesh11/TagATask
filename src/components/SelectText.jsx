import React, { useState, useRef, useEffect } from 'react';
import './selecttext.css';

const SelectText = ({ toggleBold, toggleItalic  }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
  const [selectionRange, setSelectionRange] = useState(null);
  const optionsRef = useRef(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Get the dimensions of the options div (if it exists)
      const optionsHeight = optionsRef.current ? optionsRef.current.offsetHeight : 0;
      const optionsWidth = optionsRef.current ? optionsRef.current.offsetWidth : 0;
      
      // Calculate the initial position (above the selected text)
      let topPosition = rect.top + window.scrollY - optionsHeight - 10; // 10px buffer above
      let leftPosition = rect.left + window.scrollX;
      
      // Adjust position if the options div goes out of viewport
      if (topPosition < 0) {
        topPosition = rect.bottom + window.scrollY + 10; // Position below the text if above is out of view
      }
      
      if (leftPosition + optionsWidth > window.innerWidth) {
        leftPosition = window.innerWidth - optionsWidth - 10; // Make sure it doesn't overflow the right edge
      }
      
      if (leftPosition < 0) {
        leftPosition = 10; // Make sure it doesn't overflow the left edge
      }

      // Set position and range
      setOptionsPosition({
        top: topPosition,
        left: leftPosition,
      });
      setSelectionRange(range);
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  const toggleStyle = (style, value) => {
    if (selectionRange) {
      const selectedContent = selectionRange.extractContents();
      const span = document.createElement('span');
      span.appendChild(selectedContent);

      const parentSpan = selectionRange.startContainer.parentElement;

      switch (style) {
        case 'backgroundColor':
          span.style.backgroundColor = parentSpan.style.backgroundColor === value ? 'transparent' : value;
          break;
        case 'fontWeight':
          span.style.fontWeight = parentSpan.style.fontWeight === 'bold' ? 'normal' : 'bold';
          break;
        case 'fontStyle':
          span.style.fontStyle = parentSpan.style.fontStyle === 'italic' ? 'normal' : 'italic';
          break;
        case 'textDecoration':
          span.style.textDecoration = parentSpan.style.textDecoration === 'underline' ? 'none' : 'underline';
          break;
        default:
          break;
      }

      selectionRange.deleteContents();
      selectionRange.insertNode(span);
    }
  };

  const insertLink = () => {
    if (selectionRange) {
      const url = prompt('Enter the URL');
      if (url) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.target = '_blank';
        anchor.textContent = selectionRange.toString();
        selectionRange.deleteContents();
        selectionRange.insertNode(anchor);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {showOptions && (
        <div
          ref={optionsRef}
          className="options-popup"
          style={{ top: `${optionsPosition.top}px`, left: `${optionsPosition.left}px`, position: 'absolute' }}
        >
          <button onClick={() => toggleStyle('fontWeight', 'bold')}>B</button>
          <button onClick={() => toggleStyle('fontStyle', 'italic')}>I</button>
          <button onClick={() => toggleStyle('backgroundColor', 'yellow')}>H</button>
          <button onClick={() => toggleStyle('textDecoration', 'underline')}>U</button>
          <button onClick={insertLink}>Link</button>
        </div>
      )}
    </>
  );
};

export default SelectText;
