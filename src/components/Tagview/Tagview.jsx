import React from "react";

function Tagview() {
    const tagviewdata = {
        TagATask: [
          [1, "Task One", "2024-01-01", "2024-01-02", 26, 219],
          [2, "Task Two", "2024-01-03", "2024-01-04", 26, 219],
          [3, "Task Three", "2024-01-05", "2024-01-06", 26, 219],
        ],
        CRM: [
          [4, "Task Four", "2024-01-07", "2024-01-08", 27, 220],
          [5, "Task Five", "2024-01-09", "2024-01-10", 27, 220],
          [6, "Task Six", "2024-01-11", "2024-01-12", 27, 220],
        ],
        WhereDoc: [
          [7, "Task Seven", "2024-01-13", "2024-01-14", 28, 221],
          [8, "Task Eight", "2024-01-15", "2024-01-16", 28, 221],
          [9, "Task Nine", "2024-01-17", "2024-01-18", 28, 221],
          [10, "Task Ten", "2024-01-19", "2024-01-20", 28, 221],
        ],
        Finance: [
          [11, "Task Eleven", "2024-01-21", "2024-01-22", 29, 222],
          [12, "Task Twelve", "2024-01-23", "2024-01-24", 29, 222],
        ],
        HR: [
          [13, "Task Thirteen", "2024-01-25", "2024-01-26", 30, 223],
          [14, "Task Fourteen", "2024-01-27", "2024-01-28", 30, 223],
        ],
        Operations: [
          [15, "Task Fifteen", "2024-01-29", "2024-01-30", 31, 224],
          [16, "Task Sixteen", "2024-01-31", "2024-02-01", 31, 224],
        ],
        IT: [
          [17, "Task Seventeen", "2024-02-02", "2024-02-03", 31, 224],
          [18, "Task Eighteen", "2024-02-04", "2024-02-05", 31, 224],
        ],
        Sales: [
          [19, "Task Nineteen", "2024-02-06", "2024-02-07", 32, 225],
          [20, "Task Twenty", "2024-02-08", "2024-02-09", 32, 225],
        ],
        Marketing: [
          [21, "Task Twenty-One", "2024-02-10", "2024-02-11", 33, 226],
          [22, "Task Twenty-Two", "2024-02-12", "2024-02-13", 33, 226],
        ],
        Legal: [
          [23, "Task Twenty-Three", "2024-02-14", "2024-02-15", 34, 227],
          [24, "Task Twenty-Four", "2024-02-16", "2024-02-17", 34, 227],
        ],
        Procurement: [
          [25, "Task Twenty-Five", "2024-02-18", "2024-02-19", 35, 228],
          [26, "Task Twenty-Six", "2024-02-20", "2024-02-21", 35, 228],
        ],
        Admin: [
          [27, "Task Twenty-Seven", "2024-02-22", "2024-02-23", 36, 229],
          [28, "Task Twenty-Eight", "2024-02-24", "2024-02-25", 36, 229],
        ],
        Support: [
          [29, "Task Twenty-Nine", "2024-02-26", "2024-02-27", 37, 230],
          [30, "Task Thirty", "2024-02-28", "2024-02-29", 37, 230],
        ],
      };
      

  return (
    <div className="task_container">
      <div className="tasks">
        {Object.entries(tagviewdata).map(([category, tasks], cardIndex) => {
          // Assume a logged-in user's ID
          const currentPersonnelId = 26;

          // Separate tasks into "to-do" and "follow-up"
          const to_do_tasks = tasks.filter(([taskId, taskDescription, completionDate, verificationDate, allotterId, allotteeId]) => {
            return !completionDate && allotteeId === currentPersonnelId;
          });

          const follow_up_tasks = tasks.filter(([taskId, taskDescription, completionDate, verificationDate, allotterId, allotteeId]) => {
            return completionDate && !verificationDate && allotterId === currentPersonnelId;
          });

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
                {to_do_tasks.length > 0 && <h3 className="section">To-Do Tasks</h3>}
                {to_do_tasks.map(([taskId, taskDescription], index) => (
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
              <div id={`follow_up_tasks_${cardIndex}`} className="follow_up_tasks">
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tagview;
