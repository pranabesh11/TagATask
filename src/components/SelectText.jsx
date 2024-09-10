import React, { useState, useRef, useEffect } from 'react';
import './selecttext.css';

const SelectText = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
  const [selectionRange, setSelectionRange] = useState(null);  // Save the selection range
  const optionsRef = useRef(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Position the options popup relative to the selected text
      setOptionsPosition({
        top: rect.top + window.scrollY - 40,
        left: rect.left + window.scrollX,
      });

      setSelectionRange(range.cloneRange());  // Save a clone of the selection range
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  // Restore the saved selection
  const restoreSelection = () => {
    const selection = window.getSelection();
    selection.removeAllRanges();
    if (selectionRange) {
      selection.addRange(selectionRange);  // Restore the saved selection range
    }
  };

  // Custom function to wrap the selected text with a <span> tag for styling
  const wrapSelectedText = (style) => {
    if (selectionRange) {
      restoreSelection();  // Ensure the selection is restored before applying style
      const selectedText = selectionRange.extractContents();
      const span = document.createElement('span');
      
      if (style === 'bold') {
        span.style.fontWeight = 'bold';
      } else if (style === 'italic') {
        span.style.fontStyle = 'italic';
      } else if (style === 'underline') {
        span.style.textDecoration = 'underline';
      } else if (style === 'highlight') {
        span.style.backgroundColor = 'yellow';
      }

      span.appendChild(selectedText);
      selectionRange.insertNode(span);
      setSelectionRange(selectionRange.cloneRange()); // Update the range after styling
    }
  };

  const insertLink = () => {
    const url = prompt('Enter the URL');
    if (url && selectionRange) {
      restoreSelection();  // Restore the selection before inserting the link
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.appendChild(selectionRange.extractContents());
      selectionRange.insertNode(anchor);
      setSelectionRange(selectionRange.cloneRange()); // Update the range after styling
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
          <button onClick={() => wrapSelectedText('bold')}>B</button>
          <button onClick={() => wrapSelectedText('italic')}>I</button>
          <button onClick={() => wrapSelectedText('underline')}>U</button>
          <button onClick={() => wrapSelectedText('highlight')}>H</button>
          <button onClick={insertLink}>Link</button>
        </div>
      )}
    </>
  );
};

export default SelectText;
