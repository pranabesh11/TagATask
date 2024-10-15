import React, { useState } from 'react';
import './fileupload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';

const FileUpload = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const updatedFiles = [...files, ...selectedFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);  // Call the callback to update the parent component
  };  

  const handleDeleteFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);  // Call the callback to update the parent component
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
    <div className="file-upload-container">
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
          style={{ opacity: files.length > 0 ? 1 : 0.3,fontSize: 30 }}
        />
          {files.length > 0 && (
            <div className="file-list">
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    <span className="file-name" title={file.name}>{file.name}</span>
                    <FontAwesomeIcon
                      icon={faDownload}
                      onClick={() => {handleDownloadFile(file)
                        console.log("delete icon clicked");
                      }
                    }
                      className="file-action-icon"
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      onClick={(e) => {handleDeleteFile(index)
                        e.stopPropagation();
                        console.log("delete icon clicked");
                      }}
                      className="file-action-icon"
                    />
                  </li>
                ))}
              </ul>
              <label htmlFor="file-upload" className="add-file-icon">
                <FontAwesomeIcon icon={faPlus} />
              </label>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
