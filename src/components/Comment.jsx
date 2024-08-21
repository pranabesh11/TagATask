import React, { useState, useRef, useEffect } from 'react';
import './comment.css';
import messengerIcon from '../assets/messenger.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Comment = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const popupRef = useRef(null);

  const handleIconClick = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleEditChange = (e) => {
    setEditedValue(e.target.value);
  };

  const handleCommentClick = (index) => {
    setEditIndex(index);
    setEditedValue(comments[index]);
  };

  const handleDeleteComment = (index) => {
    setComments(prevComments => prevComments.filter((_, i) => i !== index));
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupOpen(false);
      saveComment();
    }
  };

  const saveComment = () => {
    if (inputValue.trim()) {
      setComments(prevComments => [...prevComments, inputValue]);
      setInputValue('');
    }
    if (editIndex !== null) {
      const updatedComments = [...comments];
      updatedComments[editIndex] = editedValue;
      setComments(updatedComments);
      setEditIndex(null);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveComment();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputValue, editIndex, editedValue]);

  return (
    <div className="comment-box-container">
      <img
        src={messengerIcon}
        alt="Comment Icon"
        className="comment-icon"
        onClick={handleIconClick}
        style={{ opacity: comments.length > 0 ? 1 : 0.3 }}
      />
      {isPopupOpen && (
        <div ref={popupRef} className="popup-container">
          {comments.map((comment, index) => (
            <div key={index} className="comment-item">
              {editIndex === index ? (
                <input
                  type="text"
                  className="edit-input"
                  value={editedValue}
                  onChange={handleEditChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveComment();
                    }
                  }}
                />
              ) : (
                <>
                  <p
                    className="saved-comment"
                    onClick={() => handleCommentClick(index)}
                  >
                    {comment}
                  </p>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="delete-icon"
                    onClick={() => handleDeleteComment(index)}
                  />
                </>
              )}
            </div>
          ))}
          <input
            type="text"
            className="comment-input"
            placeholder="Write a comment..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
        </div>
      )}
    </div>
  );
};

export default Comment;
