import React, { useState } from 'react';
import './fileupload.css';
import clip from '../assets/clip.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';

const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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
          <img 
            src={clip} 
            alt="Upload" 
            className="upload-icon" 
            style={{ opacity: files.length > 0 ? 1 : 0.3 }}
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
