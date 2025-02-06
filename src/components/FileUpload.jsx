import React, { useState } from 'react';
import './fileupload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';

const FileUpload = ({fileIndex , sendFile }) => {
  const [files, setFiles] = useState([]);
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    console.log("files .......... ;; " ,selectedFiles[0].name);

    const updatedFiles = [...files, ...selectedFiles];
    setFiles(updatedFiles);
    sendFile(fileIndex ,selectedFiles)
  };

  const handleDeleteFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    // onFilesChange(updatedFiles);
  };

  const handleDownloadFile = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="file-upload-container"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="upload-icon-container">
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" className="upload-icon-label">
          <AttachFileOutlinedIcon 
            className="upload-icon" 
            style={{ opacity: files.length > 0 ? 1 : 0.3, fontSize: 30 }}
          />
        </label>

        {/* Hover-triggered file list */}
        {isHovered && files.length > 0 && (
          <div className="file-list">
            <ul>
              {files.map((file, index) => (
                <li key={index} className="file-item">
                  <span className="file-name" title={file.name}>{file.name}</span>
                  
                  {/* Download Icon */}
                  <FontAwesomeIcon
                    icon={faDownload}
                    onClick={(e) => { 
                      e.stopPropagation();
                      handleDownloadFile(file);
                    }}
                    className="file-action-icon"
                  />
                  
                  {/* Delete Icon */}
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={(e) => { 
                      e.stopPropagation();
                      handleDeleteFile(index);
                    }}
                    className="file-action-icon delete-icon"
                  />
                </li>
              ))}
            </ul>
            <label htmlFor="file-upload" className="add-file-icon">
              <FontAwesomeIcon icon={faPlus} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;