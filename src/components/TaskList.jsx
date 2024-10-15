import React, { useState, useRef, useEffect } from 'react';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import './tasklist.css';
import clockicon from '../assets/clock.png';
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';

function TaskList({ dateTime, onDatetimeChange }) {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [hovering, setHovering] = useState(false);
    const dateTimePickerRef = useRef(null);

    const handleIconClick = () => {
        setIsPickerOpen(prev => !prev);
    };

    const handleClear = () => {
        onDatetimeChange(null);
        setIsPickerOpen(false);
    };

    const handleMouseEnter = () => {
        setHovering(true);
    };

    const handleMouseLeave = () => {
        setHovering(false);
    };
    

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dateTimePickerRef.current && !dateTimePickerRef.current.contains(event.target)) {
                setIsPickerOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="input-with-datetime">
            <div 
                className="clock-icon-wrapper" 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
            >
            <AccessAlarmOutlinedIcon
                className={`clock-icon ${dateTime ? 'black-icon' : 'grey-icon'}`}
                onClick={handleIconClick}
                style={{ fontSize: 30 }}
            />
                {hovering && dateTime && (
                    <span className="hovered-datetime">
                        {dateTime.format('YYYY-MM-DD HH:mm')}
                    </span>
                )}
            </div>
            {isPickerOpen && (
                <div ref={dateTimePickerRef} className="datetime-picker-wrapper">
                    <DateTime
                        value={dateTime}
                        onChange={(newDateTime) => {
                            onDatetimeChange(newDateTime);
                            // setIsPickerOpen(false);
                        }}
                        input={false}
                        closeOnSelect={false}
                    />
                    <button className="clear-button" onClick={handleClear}>Clear</button>
                </div>
            )}
        </div>
    );
}

export default TaskList;
