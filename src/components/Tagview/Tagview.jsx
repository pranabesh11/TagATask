import React, { useEffect, useState } from "react";
import {get_tag_data} from '../ApiList';




function Tagview() {
  const datafetchfunction = async()=>{
    const data = await get_tag_data();
    setTagViewData(data)
    console.log("this is tagviewdata -----",data);
  }
  const [tagviewdata,setTagViewData] = useState([]);
  useEffect(()=>{datafetchfunction()} ,[])
      

  return (
    <div className="task_container">
      <div className="tasks">
        {Object.entries(tagviewdata).map(([category, tasks], cardIndex) => {
          // Assume a logged-in user's ID
          const currentPersonnelId = 26;

          // // Separate tasks into "to-do" and "follow-up"
          // const to_do_tasks = tasks.filter(([taskId, taskDescription, completionDate, verificationDate, allotterId, allotteeId]) => {
          //   return completionDate === null || completionDate === ""; // Tasks that are yet to be completed
          // });
          
          // const follow_up_tasks = tasks.filter(([taskId, taskDescription, completionDate, verificationDate, allotterId, allotteeId]) => {
          //   return completionDate !== null && verificationDate === null; // Completed but not verified tasks
          // });
          
          return (
            <div
              className="allottee_container"
              key={category}
              draggable
              onDragOver={(e) => e.preventDefault()}
              // Uncomment the next lines when drag/drop functionality is implemented
              // onDragStart={() => dragAllotteeCard(cardIndex, category)}
              // onDrop={() => handleDrop(category, cardIndex)}
            >
              <p className="name_text">{category}</p>

              {/* To-Do Tasks */}
              <div id={`to_do_tasks_${cardIndex}`} className="to_do_section">
                {tasks.map(([taskId, taskDescription], index) => (
                  <div
                    key={taskId}
                    className="task-item-container"
                    draggable
                    data-task-id={taskId}
                    data-task-description={taskDescription}
                    onDragStart={(e) => e.preventDefault()}
                    // Uncomment the next lines when drag/drop functionality is implemented
                    // onDragOver={handleTaskDragOver}
                    // onDrop={() => handleTaskReorder(category, index, "To-Do", cardIndex)}
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => {}}
                      style={{ marginRight: "10px" }}
                      className="checkbox"
                    />
                    <div className="each_task">{taskDescription}</div>
                  </div>
                ))}
              </div>

              {/* Follow-Up Tasks */}
              {/* <div id={`follow_up_tasks_${cardIndex}`} className="follow_up_tasks">
                {follow_up_tasks.length > 0 && <h3 className="section">Follow-Up Tasks</h3>}
                {follow_up_tasks.map(([taskId, taskDescription], index) => (
                  <div
                    key={taskId}
                    className="task-item-container"
                    draggable
                    data-task-id={taskId}
                    data-task-description={taskDescription}
                    onDragStart={(e) => e.preventDefault()}
                    // Uncomment the next lines when drag/drop functionality is implemented
                    // onDragOver={handleTaskDragOver}
                    // onDrop={() => handleTaskReorder(category, index, "Follow-Up", cardIndex)}
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => {}}
                      style={{ marginRight: "10px" }}
                      className="checkbox"
                    />
                    <div className="each_task">{taskDescription}</div>
                  </div>
                ))}
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tagview;
