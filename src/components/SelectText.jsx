import React, { useState, useRef, useEffect } from 'react';
import './selecttext.css';

const SelectText = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
  const [selectionRange, setSelectionRange] = useState(null);
  const inputRef = useRef(null);
  const optionsRef = useRef(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setOptionsPosition({
        top: rect.top - 35 + window.scrollY,
        left: rect.left + window.scrollX,
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

  const handleLinkClick = (event) => {
    const target = event.target;
    if (target.tagName === 'A') {
      window.open(target.href, '_blank');
      event.preventDefault();
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
    <div className="select-text-container">
      <div
        ref={inputRef}
        className="text-input"
        contentEditable={true}
        placeholder="Select text to see options..."
        onClick={handleLinkClick}
      >
        This is an editable text. Select any part to apply styling.
      </div>
      {showOptions && (
        <div ref={optionsRef} className="options-popup" style={{ top: optionsPosition.top, left: optionsPosition.left }}>
          <button onClick={() => toggleStyle('fontWeight', 'bold')}>B</button>
          <button onClick={() => toggleStyle('fontStyle', 'italic')}>I</button>
          <button onClick={() => toggleStyle('backgroundColor', 'yellow')}>H</button>
          <button onClick={() => toggleStyle('textDecoration', 'underline')}>U</button>
          <button onClick={insertLink}>Link</button>
        </div>
      )}
    </div>
  );
};

export default SelectText;
