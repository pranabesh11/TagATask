import React, { useState, useRef, useEffect, useCallback } from 'react';
import './taskcreate.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import closebutton from '../assets/close.png';
import drag from '../assets/drag.png';
import TaskList from './TaskList';
import CustomSelect from './CustomSelect';
import WorkType from './WorkType';
import FileUpload from './FileUpload';
import Comment from './Comment';
import SelectText from './SelectText';
import DOMPurify from 'dompurify';
import { Axios } from 'axios';

function TaskCreate() {
  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const editableInputRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [options, setOptions] = useState([]);
  const [comments, setComments] = useState([]);

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  // Fetch options from Rails API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://7f27-49-37-9-67.ngrok-free.app/allot', {
          headers: {
            'Accept': 'application/json',  // Ensure the server understands it's JSON
          },
          mode: 'cors'  // Enable CORS for the request
        });

        // Check the data and set it to state
        setData(response.data.names);  // Assuming the response has 'names' field
        console.log('Response data:', response.data);

      } catch (error) {
        // Handle errors (e.g., network, CORS, or API errors)
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please check the console for more details.');
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchOptions = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3000/allot');
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const contentType = response.headers.get('content-type');
  //       if (!contentType || !contentType.includes('application/json')) {
  //         throw new Error('Expected JSON, but got something else');
  //       }
  //       const result = await response.json();
  //       setOptions(result.data);
  //       console.log(result);
  //     } catch (error) {
  //       console.error('Error fetching options:', error);
  //     }
  //   };
  //   fetchOptions();
  // }, []);
  

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.key === 'Escape' && !isSaving) {
        setIsSaving(true);
        saveAllData();
      }
    };
    

    const handleClick = (event) => {
      if (!containerRef.current.contains(event.target)) {
        saveAllData();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('mousedown', handleClick);
    };
  }, [isSaving]);

  

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      editableInputRef.current.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      saveAllData();
    }
  };

  const toggleBold = () => {
    if (selectedTaskIndex !== null) {
      const selectedTask = tasks[selectedTaskIndex];
      selectedTask.isBold = !selectedTask.isBold;
      setTasks([...tasks]);
    }
  };
  
  const toggleItalic = () => {
    if (selectedTaskIndex !== null) {
      const selectedTask = tasks[selectedTaskIndex];
      selectedTask.isItalic = !selectedTask.isItalic;
      setTasks([...tasks]);
    }
  };


  const createNewTask = (initialChar) => {
    const newTask = {
      text: initialChar,
      completed: false,
      datetime: null,
      label: '',
      workType: '',
      comments: [],
      isBold: false,
      isItalic: false,
      ref: React.createRef(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  
    setTimeout(() => {
      const taskElement = newTask.ref.current;
      if (taskElement) {
        taskElement.focus();
        moveCursorToEnd(taskElement);
      }
    }, 0);
  };
  
  const moveCursorToEnd = (element) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const moveCursor = (element) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
  };
  
  const handleTextSelect = (index) => {
    setSelectedTaskIndex(index);
  };
  
  

  const handleTaskKeyDown = (index, event) => {
    if (event.key === 'Escape' && !isSaving) {
      const taskElement = tasks[index]?.ref?.current;
      if (taskElement) {
        taskElement.blur();
      }
      setIsSaving(true);
      saveAllData();
      setTasks([]);
      return;
    }
  
    if (event.key === 'Backspace' && tasks[index].ref.current.innerText.trim() === '') {
      event.preventDefault();
      handleDeleteTask(index);
      if (tasks.length > 0) {
        if (index > 0) {
          const previousTask = tasks[index - 1];
          setTimeout(() => {
            previousTask.ref.current.focus();
            moveCursorToEnd(previousTask.ref.current);
          }, 0);
        } else {
          setTimeout(() => editableInputRef.current.focus(), 0);
        }
      }
    }
  
    if (event.key === 'Enter') {
      event.preventDefault();
      if (index < tasks.length - 1) {
        createNewTaskAtIndex(index + 1);
      } else {
        editableInputRef.current.focus();
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index > 0) {
        setTimeout(() => moveCursor(tasks[index - 1].ref.current), 0);
      } else {
        setTimeout(() => {
          if (tasks.length > 0) {
            const lastTaskIndex = tasks.length - 1;
            const lastTaskElement = tasks[lastTaskIndex].ref.current;
            lastTaskElement.focus();
            moveCursor(lastTaskElement);
          }
        }, 0);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (index < tasks.length - 1) {
        setTimeout(() => {
          const nextTaskElement = tasks[index + 1].ref.current;
          nextTaskElement.focus();
          moveCursorToEnd(nextTaskElement);
        }, 0);
      } else {
        setTimeout(() => editableInputRef.current.focus(), 0);
      }
    }
  };
  


  let debounceTimer = null;
  let accumulatedChars = '';
  
  const handleEditableKeyDown = (event) => {
    if (event.key === 'Escape' && !isSaving) {
      setIsSaving(true);
      saveAllData();
      return;
    }
    if (event.key === 'Backspace' && tasks.length > 0) {
      event.preventDefault();
      const lastTask = tasks[tasks.length - 1];
      setTimeout(() => moveCursor(lastTask.ref.current), 0);

    } else if (event.key === 'ArrowUp' && tasks.length > 0) {
      event.preventDefault();
      const lastTask = tasks[tasks.length - 1];
      setTimeout(() => moveCursor(lastTask.ref.current), 0);
      tasks[tasks.length - 1].ref.current.focus();
    } else if (event.key !== 'Enter' && /^[a-zA-Z0-9`~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]$/.test(event.key)) {
      event.preventDefault();
      accumulatedChars += event.key;
      clearTimeout(debounceTimer);
      editableInputRef.current.value = accumulatedChars;
        debounceTimer = setTimeout(() => {
          if (accumulatedChars) {
            createNewTask(accumulatedChars);
            accumulatedChars = '';
            editableInputRef.current.value = '';
          }
        }, 0);
      }
  };

  
  const createNewTaskAtIndex = (index) => {
    const newTask = {
      text: '',
      completed: false,
      datetime: null,
      label: '',
      ref: React.createRef(),
    };
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      newTasks.splice(index, 0, newTask);
      return newTasks;
    });
    setTimeout(() => {
      newTask.ref.current.focus();
    }, 0);
  };
  
  

  const handleDatetimeChange = (index, datetime) => {
    const newTasks = [...tasks];
    newTasks[index].datetime = datetime;
    setTasks(newTasks);
  };

  const handleLabelChange = (index, tags) => {
    const newTasks = [...tasks];
    newTasks[index].selectedTags = tags;
    setTasks(newTasks);
  };
  

  const handleDeleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const handleTaskCheck = (cardIndex, taskIndex, isChecked) => {
    if (cardIndex === null) {
      setTasks((prevTasks) => {
        const newTasks = [...prevTasks];
        if (newTasks[taskIndex]) {
          newTasks[taskIndex].completed = isChecked;
          if (isChecked) {
            const completedTask = newTasks.splice(taskIndex, 1)[0];
            newTasks.push(completedTask);
          }
        }
        return newTasks;
      });
    } else {
      setSavedItems((prevItems) => {
        const newItems = [...prevItems];
        const card = newItems[cardIndex];
    
        if (card && card.items && card.items[taskIndex]) {
          card.items[taskIndex].completed = isChecked;
          if (isChecked) {
            const completedTask = card.items.splice(taskIndex, 1)[0];
            card.items.push(completedTask);
          }
        }
    
        return newItems;
      });
    }
  };

  const cleanHTML = (dirty) => {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['strong', 'em'],
      ALLOWED_ATTR: []
    });
  };
  
  const handleTaskDragOverSmooth = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };
  
  
  const handleTaskDragStart = (e, cardIndex, taskIndex) => {
    setDraggingIndex({ cardIndex, taskIndex });
    const draggedTask = savedItems[cardIndex].items[taskIndex];
    // alert(`Dragging task: ${draggedTask.text} (Task index: ${taskIndex}, Card index: ${cardIndex})`);
    console.log(`Dragging task: ${draggedTask.text} (Task index: ${taskIndex}, Card index: ${cardIndex})`);
  };

  const handleTaskDragOver = (e) => {
    e.preventDefault();
  };

  const handleTaskDrop = (e, cardIndex, targetTaskIndex) => {
    e.preventDefault();
    if (draggingIndex && draggingIndex.cardIndex === cardIndex && draggingIndex.taskIndex !== targetTaskIndex) {
      if (cardIndex === null) {
        setTasks((prevTasks) => {
          const newTasks = [...prevTasks];
          const [movedTask] = newTasks.splice(draggingIndex.taskIndex, 1);
          newTasks.splice(targetTaskIndex, 0, movedTask);
          return newTasks;
        });
      } else {
        setSavedItems((prevItems) => {
          const newItems = [...prevItems];
          const tasks = newItems[cardIndex].items;
          const [movedTask] = tasks.splice(draggingIndex.taskIndex, 1);
          tasks.splice(targetTaskIndex, 0, movedTask);
          return newItems;
        });
      }
      setDraggingIndex(null);
    }
  };

  const handleTaskReorder = (e, cardIndex, targetTaskIndex) => {
    e.preventDefault();
  
    if (draggingIndex && draggingIndex.cardIndex === cardIndex && draggingIndex.taskIndex !== targetTaskIndex) {
      setSavedItems((prevItems) => {
        // Create a deep copy of the savedItems array
        const newItems = prevItems.map((item, i) =>
          i === cardIndex ? { ...item, items: [...item.items] } : item
        );
        const tasks = newItems[cardIndex].items; // Copy of the tasks array for immutability  
        // Log the task order before the drop
        console.log('Final task order before drop:', tasks.map(task => task.text));  
        const movedTask = tasks[draggingIndex.taskIndex]; // The task being moved  
        // Remove the moved task from its original position
        const updatedTasks = tasks.filter((_, i) => i !== draggingIndex.taskIndex);
        // Insert the dragged task at the correct position
        let insertIndex = targetTaskIndex;
        // If dragging downwards (from a lower index to a higher index), insert after the dropped-over item
        if (draggingIndex.taskIndex < targetTaskIndex) {
          insertIndex += 0; // Place the dragged task after the target task
        }
        // Insert the task at the correct position
        updatedTasks.splice(insertIndex, 0, movedTask);
        // Log the task order after the drop
        console.log('Final task order after drop:', updatedTasks.map(task => task.text));
        // Update the items array with the reordered tasks
        newItems[cardIndex].items = updatedTasks;
        return newItems; // Return the updated state
      });
      setDraggingIndex(null); // Reset the dragging index after drop
    }
  };
  
  
  
  
  
  
  

  

  const saveAllData = useCallback(() => {
    const dataToSave = {
      title: inputValue.trim(),
      items: tasks.map((task) => {
        let formattedText = DOMPurify.sanitize(task.text);
        return {
          text: formattedText,
          completed: task.completed,
          datetime: task.datetime,
          workType: task.workType,
          comments: task.comments,
          selectedTags: task.selectedTags || [],
          isBold: task.isBold || false,
          isItalic: task.isItalic || false,
        };
      }).filter((item) => item.text !== '' || item.datetime || item.selectedTags.length > 0),
    };
  
    if (dataToSave.title || dataToSave.items.length > 0) {
      setSavedItems((prevItems) => [...prevItems, dataToSave]);
      setTasks([]);
      setInputValue('');
      if (editableInputRef.current) editableInputRef.current.value = '';
      document.getElementById('inputField').focus();
      
      fetch('http://localhost:3000/dream/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
    }
    setIsSaving(false);
  }, [tasks, inputValue ]);
  
  
  
  

  const handleEditTask = (itemIndex) => {
    if (tasks.length > 0 || inputValue.trim()) {
      saveAllData();
    }
  
    const item = savedItems[itemIndex];
    setInputValue(item.title);
    setTasks(
      item.items.map((task) => ({
        ...task,
        ref: React.createRef(),
        selectedTags: task.selectedTags || [],
      }))
    );
  
    setSavedItems((prevItems) => prevItems.filter((_, index) => index !== itemIndex));
    document.getElementById('inputField').focus();
  };

  const handleTaskInput = (index, event) => {
    if (event.type === 'blur' || event.key === 'Enter') {
      const newTasks = [...tasks];
      newTasks[index].text = DOMPurify.sanitize(event.currentTarget.innerHTML, {
        ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'u', 'a'],
        ALLOWED_ATTR: ['href', 'target']
      });
      setTasks(newTasks);
      return;
    }
    const taskElement = event.currentTarget;
    taskElement.innerHTML = DOMPurify.sanitize(taskElement.innerHTML, {
      ALLOWED_TAGS: ['b', 'i', 'strong', 'em'],
    });
    setTimeout(() => {
      moveCursorToEnd(taskElement);
    }, 0);
  };

  const handleCommentsChange = (index, updatedComments) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].comments = updatedComments;
    setTasks(updatedTasks);
  };
  

  

  
    
  
    
  

  return (
    
    <div className="main_div">
      <div ref={containerRef} className="container">
        <button className="close_button" onClick={saveAllData}>
          <img src={closebutton} className="close_icon" height={15} width={15} />
        </button>
        <input
          className="title_input"
          type="text"
          id="inputField"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          autoFocus={true}
          placeholder="Title"
        />

        <div className="editable-div-container">
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`new-div`}
              draggable
              onDragStart={(e) => handleTaskDragStart(e,null, index)}
              onDragOver={handleTaskDragOver}
              onDrop={(e) => handleTaskDrop(e, null,index)}
            >
              <img className="drag_image_logo" src={drag} height={20} width={20} alt="drag" />
              <input
                type="checkbox"
                className="new-div-checkbox"
                checked={task.completed || false}
                onChange={(e) => handleTaskCheck(null, index, e.target.checked)}
              />
              <div
                contentEditable
                suppressContentEditableWarning={true}
                onInput={(e) => handleTaskInput(index, e)} // Typing input
                onBlur={(e) => handleTaskInput(index, e)}  // Save on blur
                onMouseUp={() => handleTextSelect(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Escape') {
                    handleTaskKeyDown(index, e); // Handle other keys
                  }
                }}
                ref={task.ref}
                className="new-div-input"
                style={{ border: '1px solid #ccc', padding: '5px', minHeight: '20px', whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: task.text }} // Only rendered when loading the tasks initially
              />

              {selectedTaskIndex === index && 
                <SelectText 
                  targetRef={task.ref} 
                  // toggleBold={toggleBold}
                  // toggleItalic={toggleItalic}
                />
              }
              
              <TaskList
                dateTime={task.datetime}
                onDatetimeChange={(newDatetime) => handleDatetimeChange(index, newDatetime)}
                onKeyDown={(e) => handleTaskKeyDown(index, e)}
              />
                
              <div id ='icon_div'>
                <div>
                  <CustomSelect
                    selectedTags={task.selectedTags} 
                    onSelectTags={(tags) => handleLabelChange(index, tags)}
                  />
                </div>

                <div>
                  <Comment
                    comments={Array.isArray(task.comments) ? task.comments : []}
                    setComments={(updatedComments) => handleCommentsChange(index, updatedComments)}
                  />
                </div>

                <div>
                  <FileUpload/>
                </div>

                <div className='timer_inp'>
                  <WorkType  selectedOption={task.workType}
                    setSelectedOption={(value) => {
                      const updatedTasks = [...tasks];
                      updatedTasks[index].workType = value;
                      setTasks(updatedTasks);
                    }}
                  />
                </div>

              </div>

              <button className="delete-button" onClick={() => handleDeleteTask(index)}>
                <DeleteOutlinedIcon className='cross_button' style={{ fontSize: 30 }}/>
              </button>
            </div>
          ))}
          <div className="editable-input-container">
            <FontAwesomeIcon icon={faPlus} className="plus-icon" />
            <input
              id="editableInput"
              ref={editableInputRef}
              type="text"
              onKeyDown={handleEditableKeyDown}
              placeholder="Add Task"
              style={{
                padding: '5px',
                minHeight: '20px',
                width: '100%',
                outline: 'none',
                border: 'none',
              }}
            />
          </div>
        </div>
      </div>
      <div className="saved-items">
        {savedItems.map((item, itemIndex) => (
          <div key={itemIndex} 
               className="card"
               onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleEditTask(itemIndex);
                }
              }}
               >
            <h1>{item.title}</h1>

            {item.items.map((task, index) => (
              <div
                key={index}
                className={`card-item ${draggingIndex && draggingIndex.cardIndex === itemIndex && draggingIndex.taskIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleTaskDragStart(e, itemIndex, index)} // Start dragging
                onDragOver={handleTaskDragOverSmooth} // Allow drag over
                onDrop={(e) => handleTaskReorder(e, itemIndex, index)} // Handle the drop and reordering
                onDragEnd={() => setDraggingIndex(null)}
              >
                <img className="drag_image_logo" src={drag} height={20} width={20} alt="drag" />
                <input
                  type="checkbox"
                  checked={task.completed || false}
                  onChange={(e) => handleTaskCheck(itemIndex, index, e.target.checked)}
                />
                <div 
                  className="task-content"
                  dangerouslySetInnerHTML={{ __html: task.text }}
                  style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <ul>
          {options.map((option, index) => (
            <li key={index}>{option.name}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default TaskCreate;