import React, { useState, useRef, useEffect } from 'react';
import './selecttext.css';

const SelectText = ({ targetRef }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
  const [selectionRange, setSelectionRange] = useState(null);
  const optionsRef = useRef(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const parentRect = targetRef.current.getBoundingClientRect();

      setOptionsPosition({
        top: rect.top - parentRect.top - 40,
        left: rect.left - parentRect.left,
      });

      setSelectionRange(range.cloneRange());  
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  
  const restoreSelection = () => {
    const selection = window.getSelection();
    selection.removeAllRanges();
    if (selectionRange) {
      selection.addRange(selectionRange);
    }
  };

  
  const wrapSelectedText = (style) => {
    if (selectionRange) {
      restoreSelection();
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
      setSelectionRange(selectionRange.cloneRange());
    }
  };

  const insertLink = () => {
    const url = prompt('Enter the URL');
    if (url && selectionRange) {
      restoreSelection();
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.appendChild(selectionRange.extractContents());
      selectionRange.insertNode(anchor);
      setSelectionRange(selectionRange.cloneRange());
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
