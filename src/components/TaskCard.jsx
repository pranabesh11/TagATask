import React, { useState } from 'react';
import './taskcard.css';
import drag from '../assets/drag.png';
import moment from 'moment';

const TaskCard = ({ data, color, onCheck }) => {
    const [tasks, setTasks] = useState(data.items);
    const [draggingIndex, setDraggingIndex] = useState(null);

    const handleCheckboxChange = (e, index) => {
        e.stopPropagation(); // Prevent triggering the parent onClick
        onCheck(index, e.target.checked); // Call the onCheck function passed from the parent
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('taskIndex', index);
        setDraggingIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Prevent default to allow drop
    };

    const handleDrop = (e, index) => {
        const draggedTaskIndex = e.dataTransfer.getData('taskIndex');
        if (draggedTaskIndex !== index) {
            const updatedTasks = [...tasks];
            const [draggedTask] = updatedTasks.splice(draggedTaskIndex, 1);
            updatedTasks.splice(index, 0, draggedTask);
            setTasks(updatedTasks);
        }
        setDraggingIndex(null);
    };

    const handleDragEnd = () => {
        setDraggingIndex(null);
    };

    return (
        <div className="card" style={{ backgroundColor: color }}>
            <h1>{data.title}</h1>
            {tasks.map((item, index) => (
                <div
                    key={index}
                    className={`card-item ${draggingIndex === index ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                >
                    <img className='drag_image_logo' src={drag} height={20} width={20} alt="drag"/>
                    <input 
                        type="checkbox"
                        checked={item.completed} 
                        onChange={(e) => handleCheckboxChange(e, index)} 
                    />
                    <div className="task-content">
                        <p style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                            {item.text}
                        </p>
                        {item.label && (
                            <p className="item-label" style={{ color: '#555', margin: '5px 0' }}>
                                Label: {item.label}
                            </p>
                        )}
                        {item.datetime && (
                            <p className="item-datetime" style={{ color: '#999', fontSize: '0.9em' }}>
                                Due: {moment(item.datetime).format('YYYY-MM-DD HH:mm')}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskCard;
