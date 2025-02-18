import React, { useState, useRef, useEffect } from "react";
import "./selecttext.css";

const SelectText = ({ targetRef, tasks, setTasks, index }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
  const [selectionRange, setSelectionRange] = useState(null);
  const optionsRef = useRef(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    console.log("selection text" , selection);
    
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


  const applyFormat = (style) => {
    if (!selectionRange) return;
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    console.log("selection text 2" , selectedText);

    if (!selectedText) return;

    let taskText = tasks[index].text;
    const formatTags = {
      bold: "b",
      italic: "i",
      underline: "u",
      highlight: 'span style="background-color: yellow;"',
    };
    
    const tag = formatTags[style];
    const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, "gi");
    const formattedText = taskText.includes(`<${tag}>${selectedText}</${tag}>`)
      ? taskText.replace(regex, selectedText)
      : taskText.replace(selectedText, `<${tag}>${selectedText}</${tag}>`);
    
    const updatedTasks = [...tasks];
    updatedTasks[index].text = formattedText;
    setTasks(updatedTasks);
    setShowOptions(false);
  };

  const insertLink = () => {
    const url = prompt("Enter the URL");
    if (url && selectionRange) {
      const selection = window.getSelection();
      const selectedText = selection.toString();
      if (!selectedText) return;

      const updatedText = tasks[index].text.replace(
        selectedText,
        `<a href="${url}">${selectedText}</a>`
      );

      const updatedTasks = [...tasks];
      updatedTasks[index].text = updatedText;
      setTasks(updatedTasks);
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    return () => document.removeEventListener("mouseup", handleTextSelection);
  }, []);

  return (
    showOptions && (
      <div
        ref={optionsRef}
        className="options-popup"
        style={{ top: `${optionsPosition.top}px`, left: `${optionsPosition.left}px`, position: "absolute" }}
      >
        <button onClick={() => applyFormat("bold")}>B</button>
        <button onClick={() => applyFormat("italic")}>I</button>
        <button onClick={() => applyFormat("underline")}>U</button>
        <button onClick={() => applyFormat("highlight")}>H</button>
        <button onClick={insertLink}>Link</button>
      </div>
    )
  );
};

export default SelectText;
