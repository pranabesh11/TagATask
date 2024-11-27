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
                    style={{ border: '1px solid #ccc', padding: '5px', minHeight: '20px', whiteSpace: 'pre-wrap',textDecoration: datetime ? 'line-through' : 'none', }}
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