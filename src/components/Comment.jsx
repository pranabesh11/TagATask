import React, { useState, useRef, useEffect } from 'react';
import './comment.css';
import messengerIcon from '../assets/messenger.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const Comment = ({ comments, sendComments, comment_index, comment_count, comment_delete }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
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
    comment_delete(comment_index, index);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupOpen(false);
      saveComment();
    }
  };

  const saveComment = () => {
    if (inputValue.trim()) {
      const newComments = [inputValue];
      setInputValue('');
      sendComments(newComments, comment_index);
      comment_count(newComments.length);
    }
    if (editIndex !== null) {
      const updatedComments = [...comments];
      updatedComments[editIndex] = editedValue;
      sendComments(updatedComments, comment_index);
      comment_count(updatedComments.length);
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
      <ChatBubbleOutlineOutlinedIcon
        className="comment-icon"
        onClick={handleIconClick}
        style={{ opacity: comments.length > 0 ? 1 : 0.3, cursor: 'pointer', fontSize: 30 }}
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
                  onKeyDown={(e) => e.key === 'Enter' && saveComment()}
                />
              ) : (
                <>
                  <Tooltip id={`my-tooltip-${index}`} clickable  style={{ backgroundColor: "white", border: "none", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" }} 
                  >
                    <div className="custom-tooltip">
                      <div className="tooltip-message">{comment[0]}</div>
                      <div className="tooltip-footer">
                        <span className="tooltip-author">{comment[1]}</span>
                        <span className="tooltip-time">{comment[2]}</span>
                      </div>
                    </div>
                  </Tooltip>

                  <div className="comment-box">
                    <div className="comment-section">
                      <p
                        className="saved-comment"
                        onClick={() => handleCommentClick(index)}
                        data-tooltip-id={`my-tooltip-${index}`}
                        data-tooltip-place="top"
                      >
                        {comment[0]}
                      </p>

                      {/* <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="delete-icon"
                        onClick={() => handleDeleteComment(index)}
                      /> */}
                    </div>
                  </div>
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