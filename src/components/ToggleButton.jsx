import React from 'react';
import styled from 'styled-components';

const Switch = ({ onToggleChange }) => {
    const handleChange = (event) => {
        onToggleChange(event.target.checked);
    };
  return (
    <StyledWrapper>
      <label className="switch">
          <input className="toggle-state" type="checkbox" name="check" defaultValue="check" onChange={handleChange}/>
          <span className="slider" />
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* The switch - the box around the slider */
  .switch {
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 2em;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: #A7B49E;
    border-radius: 50px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .slider:before {
    position: absolute;
    content: "";
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2em;
    width: 2em;
    inset: 0;
    background-color: white;
    border-radius: 50px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.4);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .switch input:checked + .slider {
    background: #818C78;
  }

  .switch input:focus + .slider {
    box-shadow: 0 0 1px #818C78;
  }

  .switch input:checked + .slider:before {
    transform: translateX(1.6em);
  }`;

export default Switch;