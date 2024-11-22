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
import { sendUserId, fetchData, fetchAllottee ,updateTaskOrderAPI } from './ApiList';
import  ToggleButton  from './ToggleButton';


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
  const [draggingTask, setDraggingTask] = useState(null);
  const [draggingAllottee, setDraggingAllottee] = useState(null);
  const [isToggleOn, setIsToggleOn] = useState(false);

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [Allottee, setAllottee] = useState({});
  const [editingTask, setEditingTask] = useState(null);


  
  useEffect(() => {
    sendUserId(setData, setError);
    fetchData(setData, setError);
    fetchAllottee(setAllottee, setError);
  }, []);

  
  


  useEffect(() => {
    // Rename the internal function to handleSaveEditTask
    const handleSaveEditTask = async (taskId, allotteeId, updatedText) => {
      try {
        const dataToEdit = {
          task_id: taskId,
          allottee_id: allotteeId,
          text: updatedText,
        };
        const response = await fetch('https://e487-49-37-9-67.ngrok-free.app/edit_task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'any',
          },
          body: JSON.stringify(dataToEdit),
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;
        
        if (data) {
          console.log('Edit Success:', data);
          setTimeout(fetchAllotteeData, 200);
          setTasks([]);
          setInputValue('');
          setEditingTask(null);
        } else {
          console.error('No data returned from edit task API');
        }
      } catch (error) {
        console.error('Error saving edited task:', error);
      }
    };
  
    const handleClickOutside = (event) => {
      if (editingTask && containerRef.current && !containerRef.current.contains(event.target)) {
        const { taskId, allotteeId, taskRef } = editingTask;
        const updatedText = taskRef.current.innerText.trim();
  
        if (updatedText) {
          handleSaveEditTask(taskId, allotteeId, updatedText);
          console.log("Clicked outside - edited task saved");
        } else {
          console.log("Clicked outside - no text to save for edited task");
        }
  
        setEditingTask(null); // Exit edit mode
      }
    };
  
    window.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingTask]);
  












  
  


  useEffect(() => {
    const saveAllDataWithInputValue = () => {
      if (!inputValue) {
        console.log("Input value is required to save data");
        return;
      }
  
      // Using the existing saveAllData code structure but making sure inputValue is present
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
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to save data');
            }
            return response.json();
          })
          .then(data => {
            console.log('Success:', data);
            notify_success();
            fetchAllotteeData();
          })
          .catch((error) => {
            console.error('Error:', error);
            notify_fail();
          });
      }
  
      setIsSaving(false);
    };
  
    const handleClick = (event) => {
      if (containerRef.current && containerRef.current.contains(event.target)) {
        console.log("Clicked inside");
      } else {
        saveAllDataWithInputValue();
        console.log("Clicked outside");
      }
    };
  
    window.addEventListener('mousedown', handleClick);
  
    return () => {
      window.removeEventListener('mousedown', handleClick);
    };
  }, [inputValue, tasks, userId]);
  
  
  
  


  // const handleChange = (event) => {
  //   setInputValue(event.target.value);
  // };
  const handleCheckboxChange = async (taskId, isChecked) => {
    if (!taskId || typeof isChecked !== "boolean") {
      console.error("Invalid parameters passed to handleCheckboxChange:", {
        taskId,
        isChecked,
      });
      return;
    }
  
    // Access setAllottee directly from the component's state
    setAllottee((prevAllottee) => {
      const updatedAllottee = { ...prevAllottee };
      Object.entries(updatedAllottee).forEach(([allotteeName, tasks]) => {
        const taskIndex = tasks.findIndex((task) => task[0] === taskId);
        if (taskIndex !== -1) {
          updatedAllottee[allotteeName][taskIndex][2] = isChecked
            ? new Date().toISOString()
            : null;
        }
      });
      return updatedAllottee;
    });
  
    try {
      const response = await axios.post(
        "https://e487-49-37-9-67.ngrok-free.app/done_mark",
        {
          task_id: taskId,
          completed: isChecked,
        }
      );
  
      if (!response.data.success) {
        console.error("Backend failed to update task status:", response.data.errors);
      }
    } catch (networkError) {
      console.error("Network error while updating task status:", networkError);
    }
  };
  
  
  const showToastMessage = () => {
    toast.warn("Please select an Allottee", {
      position: "top-center",
      style: { backgroundColor: "white", color: "black" }
    });
  };

  const showToast = (type , position , message )=>{
    const validPosition = position || "top-center";
    const toastStyles = { backgroundColor: "white", color: "black" };
    if(type == 'success'){
      toast.success(
        message,{
          position:validPosition,
          style: toastStyles
        }
      );
    }
    else if(type=="warning"){
      toast.warn(message,{
        position:validPosition,
        style: toastStyles
      });
    }
    else if(type == "error"){
      toast.error(message,{
        position:validPosition,
        style: toastStyles
      })
    }else {
      console.error(`Unknown toast type: ${type}`);
    }
  }

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
    if (!inputValue) {
      showToastMessage();
      return;
    }
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
    if (!inputValue) {
      showToastMessage();
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


  // const handleTaskDragStart = (e, cardIndex, taskIndex) => {
  //   setDraggingIndex({ cardIndex, taskIndex });
  //   const draggedTask = savedItems[cardIndex].items[taskIndex];
  //   // alert(`Dragging task: ${draggedTask.text} (Task index: ${taskIndex}, Card index: ${cardIndex})`);
  //   console.log(`Dragging task: ${draggedTask.text} (Task index: ${taskIndex}, Card index: ${cardIndex})`);
  // };

  // const handleTaskDragOver = (e) => {
  //   e.preventDefault();
  // };
  
  

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
  
  
  
  

  

  // const handleTaskReorder = (e, cardIndex, targetTaskIndex) => {
  //   e.preventDefault();

  //   if (draggingIndex && draggingIndex.cardIndex === cardIndex && draggingIndex.taskIndex !== targetTaskIndex) {
  //     setSavedItems((prevItems) => {
  //       const newItems = prevItems.map((item, i) =>
  //         i === cardIndex ? { ...item, items: [...item.items] } : item
  //       );
  //       const tasks = newItems[cardIndex].items;  
  //       console.log('Final task order before drop:', tasks.map(task => task.text));
  //       const movedTask = tasks[draggingIndex.taskIndex];  
  //       const updatedTasks = tasks.filter((_, i) => i !== draggingIndex.taskIndex);
  //       let insertIndex = targetTaskIndex;
  //       if (draggingIndex.taskIndex < targetTaskIndex) {
  //         insertIndex += 0;
  //       }
  //       updatedTasks.splice(insertIndex, 0, movedTask);
  //       console.log('Final task order after drop:', updatedTasks.map(task => task.text));
  //       newItems[cardIndex].items = updatedTasks;
  //       return newItems;
  //     });
  //     setDraggingIndex(null);
  //   }
  // };

  const handleTaskDragStart = (taskId, taskDescription, allotteeName) => {
    setDraggingTask({ taskId, taskDescription, allotteeName });
  };

  
  const handleTaskDragOver = (e) => {
    e.preventDefault();
  };
  
 
// const handleTaskReorder = (targetAllotteeName, targetTaskIndex) => {
//   if (!draggingTask) return;

//   const updatedAllottee = { ...Allottee };
//   const sourceTasks = updatedAllottee[draggingTask.allotteeName];
//   const targetTasks = updatedAllottee[targetAllotteeName];
//   const draggedTaskIndex = sourceTasks.findIndex(task => task[0] === draggingTask.taskId);
//   const [draggedTask] = sourceTasks.splice(draggedTaskIndex, 1);
//   targetTasks.splice(targetTaskIndex, 0, draggedTask);
//   const reorderedTasks = targetTasks.map(task => ({
//     taskId: task[0],
//     description: task[1],
//   }));
//   updateTaskOrderAPI(reorderedTasks);
//   setAllottee(updatedAllottee);
//   setDraggingTask(null);
//   console.log('Previous Order:', sourceTasks);
//   console.log('New Order:', targetTasks);
// };


const handleTaskReorder = (targetAllotteeName, targetTaskIndex) => {
  if (!draggingTask) return;

  const updatedAllottee = { ...Allottee };
  const sourceTasks = updatedAllottee[draggingTask.allotteeName];
  const targetTasks = updatedAllottee[targetAllotteeName];
  const draggedTaskIndex = sourceTasks.findIndex(task => task[0] === draggingTask.taskId);
  const [draggedTask] = sourceTasks.splice(draggedTaskIndex, 1);

  // Determine targetTaskId based on drop position
  let targetTaskId = null;
  if (targetTaskIndex === 0) {
    targetTaskId = "top";  // Dropped at the top position
  } else if (targetTaskIndex === targetTasks.length) {
    targetTaskId = targetTasks[targetTasks.length - 1][0]; // ID of the last task
  } else {
    targetTaskId = targetTasks[targetTaskIndex - 1][0]; // ID of the item just above the drop position
  }

  // Insert the dragged task at the new position
  targetTasks.splice(targetTaskIndex, 0, draggedTask);

  // Log to Chrome console
  console.log("Dragged Task ID:", draggingTask.taskId);
  console.log("Dropped Over Task ID:", targetTaskId);

  // Prepare reordered task list for backend
  const reorderedTasks = targetTasks.map(task => ({
    taskId: task[0],
    description: task[1],
  }));

  // Send reorderedTasks, draggedTaskId, and targetTaskId to backend
  updateTaskOrderAPI(reorderedTasks, draggingTask.taskId, targetTaskId);

  setAllottee(updatedAllottee);
  setDraggingTask(null);
};


  
const fetchAllotteeData = async () => {
  try {
    const userId = new URLSearchParams(window.location.search).get('id');
    const response = await axios.get(`https://e487-49-37-9-67.ngrok-free.app/task_data?user_id=${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': "any",
      },
    });
    console.log('Fetched tasks:', response.data);
    setAllottee(response.data.personnels);
  } catch (error) {
    console.error('Error fetching task data:', error);
  }
};










  const saveAllData = useCallback(() => {
    console.log("Saving all data", { inputValue, tasks }); // Debugging line
    const params = new URLSearchParams(window.location.search);
    const notify_success = () => toast.success("Task Created Successfully !");
    const notify_fail = () => toast.error("Task Creation Failed !");
    const notify_warning = () => toast.warn("Please select Allottee Name", {
      position: "top-center", 
      style: { backgroundColor: "#ffcc00", color: "#fff" }
    });
    if (inputValue==="") { 
      // notify_warning();
      return;
    }

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
    console.log("Data to Save:", dataToSave);

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
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to save data');
          }
          return response.json();
        })
        .then(data => {
          console.log('Success:', data);
          notify_success();
          fetchAllotteeData();
        })
        .catch((error) => {
          console.error('Error:', error);
          notify_fail();
        });      
    }
    console.log("Saving all data", { inputValue, tasks }); // Verify state
    console.log("Data to Save:", dataToSave); // Verify the payload

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const allotteeId = await fetchAllotteeId(allotteeName);
    if (allotteeId) {
        setInputValue(allotteeId);
        console.log(`Allottee ID set to ${allotteeId} for name: ${allotteeName}`);
    } else {
        console.error('ID not found for the provided name.');
    }
    const taskRef = React.createRef();
    setEditingTask({ taskId, allotteeId, taskRef });
    setTasks([{ text: taskDescription, ref: taskRef }]);
    setTimeout(() => {
        if (taskRef.current) {
            taskRef.current.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === 'Escape') {
                  event.preventDefault();
                  const updatedText = taskRef.current.innerText;
                  saveEditTask(taskId, allotteeId, updatedText);
                  setEditingTask(null);
                }
            });
        }
    }, 0);
};

const saveEditTask =  async (taskId, allotteeId, updatedText) => {
    try {
        const dataToEdit = {
          task_id: taskId,
          allottee_id: allotteeId,
          text: updatedText,
        };
        const response = await fetch('https://e487-49-37-9-67.ngrok-free.app/edit_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ngrok-skip-browser-warning': 'any',
            },
            body: JSON.stringify(dataToEdit),
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;
        
        if (data) {
          console.log('Edit Success:', data);
          setTimeout(fetchAllotteeData, 200);
          setTasks([]);
          setInputValue('');
          setEditingTask(null);
        } else {
          console.error('No data returned from edit task API');
        }
    } catch (error) {
        console.error('Error saving edited task:', error);
    }
};

const fetchAllotteeId = async (allotteeName) => {
    try {
        const response = await axios.post(
            'https://e487-49-37-9-67.ngrok-free.app/id_name_converter',
            { name: allotteeName },
            { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
        );
        const allotteeId = response.data.id_name_converter;
        console.log("Fetched Allottee ID:", allotteeId);
        return allotteeId;
    } catch (error) {
        console.error('Error fetching ID for allottee name:', error);
        return null;
    }
};

const handleDropOnAllotteeContainer = async (targetAllotteeName) => {
  if (!draggingTask) return;

  console.log("Dragged Task ID:", draggingTask.taskId);
  console.log("Dropped on Allottee:", targetAllotteeName);
  const dataToSend = {
    taskId: draggingTask.taskId,
    newAllottee: targetAllotteeName,
  };

  try {
    const response = await axios.post(
      "https://e487-49-37-9-67.ngrok-free.app/task_transfer",
      dataToSend,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "any"
        }
      }
    );
    setTimeout(fetchAllotteeData, 0);
    toast.success("Task transferred Successfully !", {
      position: "top-center", 
      style: { backgroundColor: "white", color: "black" },
    });
    console.log("API response:", response.data);
  } catch (error) {
    console.error("Error sending task transfer data:", error);
  }
};

const handleAllotteeReorder = (targetAllotteeName) => {
  if (!draggingAllottee || draggingAllottee === targetAllotteeName) {
    console.log("No draggingAllottee or dropped on the same allottee.");
    return;
  }

  // Log the dragged and dropped allottee_container
  console.log("Dragged Allottee:", draggingAllottee);
  console.log("Dropped Over Allottee:", targetAllotteeName);

  const updatedAllotteeOrder = Object.entries(Allottee).reduce((result, [name, tasks]) => {
    if (name === targetAllotteeName) {
      result.push([draggingAllottee, Allottee[draggingAllottee]]);
    }
    if (name !== draggingAllottee) {
      result.push([name, tasks]);
    }
    return result;
  }, []);

  const newAllotteeState = Object.fromEntries(updatedAllotteeOrder);
  setAllottee(newAllotteeState);

  // Log the new full order of Allottee
  console.log("Full Allottee Order After Reorder:", Object.keys(newAllotteeState));
  const userId = new URLSearchParams(window.location.search).get('id');
  const dataToSend = {
    current_user : userId,
    draggedAllottee: draggingAllottee,
    droppedAllottee: targetAllotteeName,
    fullOrder: Object.keys(newAllotteeState),
  };
  axios
    .post("https://e487-49-37-9-67.ngrok-free.app/allottee_card_reorder", dataToSend, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((response) => {
      console.log("Backend response:", response.data);
      fetchAllotteeData();
      toast.success("Reorder successful!", {
        position: "top-center", 
        style: { backgroundColor: "white", color: "black" },
      });
    })
    .catch((error) => {
      console.error("Error sending allottee reorder data:", error);
    });

  setDraggingAllottee(null);
};


const handleDrop = (allotteeName) => {
  if (draggingTask) {
    handleDropOnAllotteeContainer(allotteeName);
  } else if (draggingAllottee) {
    handleAllotteeReorder(allotteeName);
  }
};

const handleToggleChange = (newState) => {
  console.log('Toggle button state:', newState);
  setIsToggleOn(newState); // Update state in TaskCreate
};

  


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
      {/* <div className="saved-items">
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
      </div> */}

      <div>
        <ul>
          {options.map((option, index) => (
            <li key={index}>{option.name}</li>
          ))}
        </ul>
      </div>
      <div className='toggle_button'>
        <p>Allottee Wise</p>
        <ToggleButton onToggleChange={handleToggleChange}/>
        <p>Tag Wise</p>
      </div>
      {isToggleOn ?
      <div className='task_container'>
        <h1>Allottee Wise Tasks</h1>
        <div className='tasks'>
          {
            Object.entries(Allottee).map(([allotteeName, tasks]) => (
              <div 
                className='allottee_container' 
                key={allotteeName}
                draggable
                onDragOver={handleTaskDragOver}
                onDragStart={(e) => { 
                  setDraggingAllottee(allotteeName);
                  console.log("Dragging allottee:", allotteeName);
                }}
                onDrop={() => handleDrop(allotteeName)}
              >
                <p className='name_text'>{allotteeName}</p>
                <div>
                {tasks.map(([taskId, taskDescription, datetime], index) => (
                <div 
                  key={taskId} 
                  className="task-item-container"
                  draggable
                  onDragStart={() => handleTaskDragStart(taskId, taskDescription, allotteeName)}
                  onDragOver={handleTaskDragOver}
                  onDrop={() => handleTaskReorder(allotteeName, index)}
                  onDragEnd={() => setDraggingTask(null)}  // Reset dragging state on end
                >
                  <img className="drag_image_logo" src={drag} height={15} width={15} alt="drag" />
                  <input
                    type="checkbox"
                    checked={!!datetime}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleCheckboxChange(taskId, e.target.checked)}
                    style={{ marginRight: '10px' }}
                  />
                  <div
                    onClick={() => editTask(taskId, taskDescription,allotteeName)}
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
      :
      <div className='task_container'>

      </div>
      }
    </div>
  );
}

export default TaskCreate;