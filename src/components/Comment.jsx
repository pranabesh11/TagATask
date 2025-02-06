import React, { useState, useRef, useEffect } from 'react';
import './comment.css';
import messengerIcon from '../assets/messenger.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import "react-tooltip/dist/react-tooltip.css";
import {Tooltip} from "react-tooltip";

const Comment = ({comments,sendComments ,comment_index , comment_count,comment_delete}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const popupRef = useRef(null);

console.log("......................" , comments);

  const handleIconClick = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // const handleEditChange = (e) => {
  //   setEditedValue(e.target.value);
  // };

  // const handleCommentClick = (index) => {
  //   setEditIndex(index);
  //   setEditedValue(comments[index]);
  // };

  // const handleDeleteComment = (index) => {
  //   setComments(prevComments => prevComments.filter((_, i) => i !== index));
  //   comment_delete(comment_index,index);
  // };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupOpen(false);
      saveComment();
    }
  };

  const saveComment = () => {
    if (inputValue.trim()) {
      const newComments = [inputValue];
      //setComments(newComments);
      console.log("new comments ....", newComments);
      
      setInputValue('');
      sendComments(newComments,comment_index);
      comment_count(newComments.length);
    }
    if (editIndex !== null) {
      const updatedComments = [...comments];
      updatedComments[editIndex] = editedValue;
    //  setComments(updatedComments);
      sendComments(updatedComments,comment_index);
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
      style={{ opacity: comments.length > 0 ? 1 : 0.3, cursor: 'pointer',fontSize: 30 }}
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
                  { <Tooltip id="my-tooltip" />}
                  <div className="comment-box">
                    <div className="comment-section">
                        <p
                          className="saved-comment"
                          onClick={() => handleCommentClick(index)}
                          data-tooltip-id={comment.length > 0 ? `my-tooltip` : undefined}
                          data-tooltip-content={`${comment[0]}\n\n${comment[1]} \u00A0\u00A0\u00A0\u00A0 ${comment[2]}`}
                          data-tooltip-place="top"
                        >
                          {comment[0]}
                        </p>

                        <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="delete-icon"
                        onClick={() => handleDeleteComment(index)}
                      />
                    </div>
                    <div className="comment-time-auther">
                      <p>{comment[1]}</p>
                      <span className='comment-time'>{comment[2]}</span>
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
