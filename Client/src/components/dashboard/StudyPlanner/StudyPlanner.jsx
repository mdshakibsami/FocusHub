import React, { useState } from "react";
import Swal from "sweetalert2";
import { api } from "../../../utils/api";
import { useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAddCircleSharp } from "react-icons/io5";
import { MdAddToPhotos } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { ImFilesEmpty } from "react-icons/im";

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState([]);
  const [progressBarCount, setProgressBarCount] = useState([]);
  const [actionMenu, setActionMenu] = useState({
    subjectIdx: null,
    taskIdx: null,
  });

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(null);
  const [newSubject, setNewSubject] = useState("");
  const [taskData, setTaskData] = useState({
    topic: "",
    priority: "",
    deadline: "",
    status: "Start",
  });

  const [refetch, setRefetch] = useState(0);

  // use effect
  useEffect(() => {
    (async () => {
      const result = await api.get("/get-subject");
      setSubjects(result.data);
    })();
    (async () => {
      const result = await api.get("/subject-count");
      setProgressBarCount(result.data);
    })();
  }, [refetch]);

  // button minimization
  useEffect(() => {
    function handleClickAway(e) {
      if (actionMenu.subjectIdx !== null && actionMenu.taskIdx !== null) {
        if (
          !e.target.closest(".action-tooltip") &&
          !e.target.closest(".action-dots-btn")
        ) {
          setActionMenu({ subjectIdx: null, taskIdx: null });
        }
      }
    }
    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, [actionMenu]);

  // Add new subject
  const handleAddSubject = async () => {
    const subject = newSubject.trim();

    if (!subject) {
      return Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please Enter a subject",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
    setShowSubjectModal(false);
    const subjectData = { subject, task: [] };
    const result = await api.post("/add-subject", subjectData);

    if (result.data.insertedId) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Subject added successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setNewSubject("");
      if (refetch > 0) setRefetch(refetch - 1);
      else setRefetch(refetch + 1);
    } else {
      setNewSubject("");
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: result.data.message || "Failed to add subject.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  // delete a subject
  const handleDeleteSubject = async (subjectIndex) => {
    const subject = subjects[subjectIndex].subject;
    // ask befor deleted by alert
    const result = await api.delete(`/delete/${subject}`);
    if (result.data.deletedCount) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Subject deleted successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      if (refetch > 0) setRefetch(refetch - 1);
      else setRefetch(refetch + 1);
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to delete subject.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  // Progress
  const handleProgress = async (sub, tIdx, status) => {
    const result = await api.put("/update-status", {
      subject: sub,
      tablerow: tIdx,
      status,
    });
    if (result.data.modifiedCount) {
      if (refetch > 0) setRefetch(refetch - 1);
      else setRefetch(refetch + 1);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Successful",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: result.data.message || "Failed to delete subject.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  // Add new task inside subject
  const handleAddTask = async (subjectIndex) => {
    if (!taskData.topic || !taskData.deadline || !taskData.priority)
      return Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please Fill all the fields.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    const subTaskData = {
      topic: taskData.topic,
      subject: subjects[subjectIndex].subject,
      deadline: taskData.deadline,
      priority: taskData.priority,
      status: "Start",
    };
    const result = await api.post("/subjects/subtask", subTaskData);
    if (result.data.modifiedCount) {
      setTaskData("");
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Task added successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      if (refetch > 0) setRefetch(refetch - 1);
      else setRefetch(refetch + 1);
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to add task.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
    setShowTaskModal(null);
  };

  // handle delete task
  const handleDeleteTask = async (tableRowIndex, subjectIndex) => {
    const deletedSubject = subjects[subjectIndex].subject;
    const deletedIndex = tableRowIndex;
    const result = await api.delete(
      `/delete-subtask/${deletedSubject}/${deletedIndex}`
    );
    if (result.data.modifiedCount) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Task deleted successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      if (refetch > 0) setRefetch(refetch - 1);
      else setRefetch(refetch + 1);
      console.log(result);
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to delete task.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="px-6 py-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg tracking-wide">
        Study Planner
      </h1>

      {/* Add Subject Button */}
      <div className="flex mb-5 justify-between items-center">
        <div>
          <h1 className="font-bold text-xl">Plan and Study Smart</h1>
        </div>
        <div>
          <h1>Progress</h1>
          <progress
            className="progress progress-success w-56"
            value={progressBarCount.completedSubtasks}
            max={progressBarCount.totalSubtasks}
          ></progress>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setShowSubjectModal(true)}
            className="px-4 py-2  bg-green-500 rounded font-bold hover:bg-green-700"
          >
            <div className="flex gap-2 items-center">
              <div>
                <IoAddCircleSharp size={25} />
              </div>
              <h1>Add Subject</h1>
            </div>
          </button>
        </div>
      </div>

      {/* Accordion for Subjects */}
      <div className="space-y-4">
        {subjects.map((sub, idx) => (
          <div key={idx} className="border border-gray-700 rounded-lg">
            <details>
              <summary className="cursor-pointer px-4 py-2 bg-gray-800 font-semibold">
                {sub.subject}
              </summary>
              <div className="p-4">
                {/* Task Button */}
                <div className="flex justify-between items-center">
                  {/* Add Task Button */}
                  <button
                    onClick={() => setShowTaskModal(idx)}
                    className="mb-3 px-3 py-1  bg-green-600 rounded hover:bg-green-700"
                    title="Add a Task"
                  >
                    <MdAddToPhotos size={24} />
                  </button>
                  {/* Delete Task Button */}
                  <button
                    onClick={() => handleDeleteSubject(idx)}
                    className="mb-3 px-3 py-1 bg-[#e64524] rounded hover:bg-green-700"
                    title={`Delete ${sub.subject}`}
                  >
                    <MdDeleteOutline size={24} />
                  </button>
                </div>
                {/* Task Table */}
                {sub.task?.length > 0 ? (
                  <table className="w-full bg-[#23272F] rounded-lg shadow text-sm border border-gray-700">
                    <thead>
                      <tr className="bg-green-500 rounded-tl-2xl">
                        <th className="py-2 px-4 text-white text-center border-r border-gray-700">
                          Topic
                        </th>
                        <th className="py-2 px-4 text-white text-center border-r border-gray-700">
                          Priority
                        </th>
                        <th className="py-2 px-4 text-white text-center border-r border-gray-700">
                          Deadline
                        </th>
                        <th className="py-2 px-4 text-white text-center border-r border-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sub.task.map((task, tIdx) => (
                        <tr
                          key={tIdx}
                          className="text-center border-b border-gray-700 hover:bg-[#131920]"
                        >
                          <td className="py-2 px-4 font-bold text-center text-white border-r border-gray-700">
                            {task.topic}
                          </td>
                          <td className="py-2 px-4 text-center border-r border-gray-700">
                            <span
                              className={` ${
                                task.priority === "High"
                                  ? "text-red-500"
                                  : task.priority === "Medium"
                                  ? "text-yellow-500"
                                  : "text-white"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-center border-r border-gray-700">
                            {task.deadline}
                          </td>
                          <td className="py-2 px-4 text-center border-r border-gray-700">
                            <div className="flex items-center justify-between relative">
                              {/* Status text in center */}
                              <div className="flex-1 text-center">
                                <button
                                  className={`px-5 py-2 font-bold min-w-30 ${
                                    task.status == "Start"
                                      ? "bg-red-500 hover:bg-red-600"
                                      : task.status === "In Progress"
                                      ? "bg-yellow-400 hover:bg-yellow-500 "
                                      : "bg-green-500 hover:bg-green-600"
                                  } rounded-lg `}
                                  onClick={() =>
                                    handleProgress(
                                      sub.subject,
                                      tIdx,
                                      task.status
                                    )
                                  }
                                >
                                  {task.status}
                                </button>
                              </div>
                              {/* Three dots button at right */}
                              <div className="mx-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActionMenu({
                                      subjectIdx: idx,
                                      taskIdx: tIdx,
                                    });
                                  }}
                                  className="focus:outline-none action-dots-btn"
                                >
                                  <BsThreeDotsVertical />
                                </button>
                                {actionMenu.subjectIdx === idx &&
                                  actionMenu.taskIdx === tIdx && (
                                    <div className="absolute right-0 top-8 z-10 bg-gray-800 border border-gray-700 rounded shadow-lg flex flex-col min-w-[100px] action-tooltip">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActionMenu({
                                            subjectIdx: null,
                                            taskIdx: null,
                                          });
                                          handleDeleteTask(tIdx, idx);
                                        }}
                                        className="px-3 py-2 text-left hover:bg-red-600 text-white rounded-b"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div>
                    <div className="flex text-red-500 justify-center">
                      <ImFilesEmpty size={40} />
                    </div>
                    <p className=" text-center text-red-500">No tasks yet.</p>
                  </div>
                )}
              </div>
            </details>
          </div>
        ))}
      </div>

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-800 p-6 rounded-lg w-80">
            <h2 className="text-lg font-semibold mb-3">Add Subject</h2>
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Enter subject name"
              className="w-full px-3 py-2 mb-3 rounded bg-gray-700 text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSubjectModal(false)}
                className="px-3 py-1 bg-gray-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubject}
                className="px-3 py-1 bg-blue-600 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal !== null && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-60">
          <div className="bg-gray-800 p-6 rounded-lg w-96 mt-30 border-1 border-green-500">
            <h2 className="text-lg font-semibold mb-3">Add Subtask</h2>
            <input
              type="text"
              value={taskData.topic}
              onChange={(e) =>
                setTaskData({ ...taskData, topic: e.target.value })
              }
              placeholder="Topic"
              className="w-full px-3 py-2 mb-3 rounded bg-gray-700 text-white"
            />
            <select
              value={taskData.priority}
              onChange={(e) =>
                setTaskData({ ...taskData, priority: e.target.value })
              }
              className="w-full px-3 py-2 mb-3 rounded bg-gray-700 text-white"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input
              type="date"
              value={taskData.deadline}
              onChange={(e) =>
                setTaskData({ ...taskData, deadline: e.target.value })
              }
              className="w-full px-3 py-2 mb-3 rounded bg-gray-700 text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTaskModal(null)}
                className="px-3 py-1 bg-gray-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddTask(showTaskModal)}
                className="px-3 py-1 bg-green-600 rounded"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
