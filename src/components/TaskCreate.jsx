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
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  const { userId } = useParams();


  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [Allottee, setAllottee] = useState({});



  useEffect(() => {
    const sendUserId = async () => {
      // Parse the query parameters from the URL
      const params = new URLSearchParams(window.location.search);
      const userId = params.get('id'); // Extract the 'id' parameter

      if (userId) {
        try {
          // Send the userId to the Rails backend via a POST request
          const response = await axios.post('https://0319-49-37-9-67.ngrok-free.app/allot', {
            user_id: userId,
          }, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': "any"
            },
          });
          if (response.data && response.data.names) {
            setData(response.data.names);
          } else {
            setError('Unexpected response structure');
          }
        } catch (error) {
          console.error('Error sending User ID:', error);
        }
      }
    };

    sendUserId();
  }, []);



  // Fetch options from Rails API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://0319-49-37-9-67.ngrok-free.app/allot', {
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': "any"
          },
        });
        if (Array.isArray(response.data.names) && response.data.names.every(item => Array.isArray(item) && item.length === 2)) {
          setData(response.data.names);
        } else {
          console.error('Unexpected data structure:', response.data.names);
          setError('Invalid data format received.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please check the console for more details.');
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    console.log("this is the task data");
    const fetchallottee = async () => {
      try {
        const response = await axios.get('https://0319-49-37-9-67.ngrok-free.app/task_data', {
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': "any"
          },
        });
        console.log(response.data.personnels);
        setAllottee(response.data.personnels);
        console.log(Allottee);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please check the console for more details.');
      }
    };

    fetchallottee();
  }, []);


  

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



  // const handleChange = (event) => {
  //   setInputValue(event.target.value);
  // };

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
    const params = new URLSearchParams(window.location.search);
    const notify_success = () => toast.success("Task Created Successfully !");
    const notify_fail = () => toast.error("Task Creation Failed !");


    const userId = params.get('id');
    const dataToSave = {
      title: inputValue.trim(),
      user_id: userId,
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

      fetch('http://localhost:3000/api_list/create_task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      })

        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          notify_success();
          fetchAllotteeData();

          axios.get('https://0319-49-37-9-67.ngrok-free.app/task_data', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'ngrok-skip-browser-warning': "any"
            },
          })
            .then(response => {
              console.log('Fetched tasks:', response.data);
              setAllottee(response.data.personnels);
            })
            .catch(error => {
              console.error('Error fetching task data:', error);
            });
        })
        .catch((error) => {
          console.error('Error:', error);
          notify_fail();
        });
    }
    setIsSaving(false);
  }, [tasks, inputValue, userId]);





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


  const editTask = async (taskId, taskDescription, allotteeName) => {
    try {
        // Fetch the allottee ID for the selected name
        const allotteeId = await fetchAllotteeId(allotteeName); 

        if (allotteeId) {
            setInputValue(allotteeId); // Set the dropdown to the allottee ID
            console.log(`Allottee ID set to ${allotteeId.id_name_converter} for name: ${allotteeName}`);
        } else {
            console.error('ID not found for the provided name.');
        }
    } catch (error) {
        console.error('Error fetching ID for allottee name:', error);
    }

    // Set task description and reference in edit mode
    setTasks([{ text: taskDescription, ref: React.createRef() }]);

    // Prepare data for editing
    const dataToEdit = {
        task_id: taskId,
        text: taskDescription,
    };

    // Post to edit task endpoint
    try {
        const response = await fetch('https://0319-49-37-9-67.ngrok-free.app/edit_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ngrok-skip-browser-warning': 'any',
            },
            body: JSON.stringify(dataToEdit),
        });
        const data = await response.json();
        console.log('Edit Success:', data);
        fetchAllotteeData(); // Refresh data after editing
    } catch (error) {
        console.error('Error editing task:', error);
    }
};

  
const fetchAllotteeId = async (allotteeName) => {
  try {
      const response = await axios.post(
          'https://0319-49-37-9-67.ngrok-free.app/id_name_converter',
          { name: allotteeName },
          { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
      );
      
      // Adjust this line to directly access the ID if nested
      const allotteeId = response.data.id_name_converter; // Adjust based on API response structure
      console.log("Fetched Allottee ID:", allotteeId); // Confirm if ID is correctly accessed here
      return allotteeId;
  } catch (error) {
      console.error('Error fetching ID for allottee name:', error);
      return null;
  }
};


  
  
  
  // const handleTaskClick = async (taskId, taskDescription, allotteeName) => {
  //   // Fetch the allottee ID based on the allotteeName
  //   const allotteeId = await fetchAllotteeId(allotteeName);
  
  //   if (allotteeId) {
  //     setInputValue(allotteeId); // Set the dropdown input value to the fetched allottee ID
  //   } else {
  //     console.error("Allottee ID not found");
  //   }
  
  //   // Set task description for editing
  //   setTasks([{ text: taskDescription, ref: React.createRef() }]);
  
  //   // Additional logic if needed...
  // };
  
  
  
  
  




  return (

    <div className="main_div">
      <div ref={containerRef} className="container">
        <button className="close_button" onClick={saveAllData}>
          <img src={closebutton} className="close_icon" height={15} width={15} />
        </button>
        <select
          className="select_allottee"
          id="inputField"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}

          autoFocus={true}
        >
          <option value="" disabled>
            Select Allottee
          </option>
          {data.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>


        <div className="editable-div-container">
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`new-div`}
              draggable
              onDragStart={(e) => handleTaskDragStart(e, null, index)}
              onDragOver={handleTaskDragOver}
              onDrop={(e) => handleTaskDrop(e, null, index)}
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

              <div id='icon_div'>
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
                  <FileUpload />
                </div>

                <div className='timer_inp'>
                  <WorkType selectedOption={task.workType}
                    setSelectedOption={(value) => {
                      const updatedTasks = [...tasks];
                      updatedTasks[index].workType = value;
                      setTasks(updatedTasks);
                    }}
                  />
                </div>

              </div>

              <button className="delete-button" onClick={() => handleDeleteTask(index)}>
                <DeleteOutlinedIcon className='cross_button' style={{ fontSize: 30 }} />
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

      {/* <div className='task_container'>
        <h1>tasks</h1>
        <div className='tasks'>
          {
            Allottee.map((Allottee_name) => {
              console.log('Allottee name', Allottee_name);
              return (
                <div className='allottee_container' >
                  <p>{Allottee_name}</p>
                </div>);
            })
          }
        </div>
      </div> */}


<div className='task_container'>
      <h1>Tasks</h1>
      <div className='tasks'>
        {
          Object.entries(Allottee).map(([allotteeName, tasks]) => (
            <div className='allottee_container' key={allotteeName}>
              <p className='name_text'>{allotteeName}</p>
              <div>
              {tasks.map(([taskId, taskDescription]) => (
              <div key={taskId} onClick={() => editTask(taskId, taskDescription,allotteeName)}>
                <div
                  suppressContentEditableWarning={true}
                  onInput={(e) => handleTaskInput(0, e)}
                  onBlur={(e) => handleTaskInput(0, e)}
                  className='each_task'
                  style={{ border: '1px solid #ccc', padding: '5px', minHeight: '20px', whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: taskDescription }}
                />
              </div>
              ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>


    </div>
  );
}

export default TaskCreate;