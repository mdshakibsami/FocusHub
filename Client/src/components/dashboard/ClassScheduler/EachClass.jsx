import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../utils/api";
import {
  MdCheckBoxOutlineBlank,
  MdDeleteSweep,
  MdLibraryAdd,
} from "react-icons/md";
import { FaRegCheckSquare } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";

async function getClasses(day) {
  const res = await api.get(`/classes/${day}`);
  return res.data;
}

const classSchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  instructor: z.string().min(2, "Instructor is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  color: z.string().min(1),
  notes: z.string().optional(),
});

const EachClass = () => {
  const params = useParams();
  const selectedDay = params.day;
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const daysOfWeek = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(classSchema),
  });

  const handleAddClass = () => {
    setShowModal(true);
  };

  useEffect(() => {
    (async () => {
      const newClass = await getClasses(selectedDay);
      setClasses(newClass);
    })();
  }, [selectedDay, showModal]);
  console.log(classes);

  const onSubmit = async (data) => {
    data.day = selectedDay;
    data.status = false;
    setShowModal(false);
    if (selectedClass?._id) {
      const res = await api.put(`/update-class/${selectedClass._id}`, data);
      if (res.data.modifiedCount) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Class is modified.",
          showConfirmButton: false,
          timer: 2000,
        });
        const newClass = await getClasses(selectedDay);
        setClasses(newClass);
        // reset();
        return;
      }
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Update Failed.",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      setShowModal(false);
      setSelectedClass(null);
      const res = await api.post("/add-class", data);
      if (res.data.insertedId) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Class added!",
          showConfirmButton: false,
          timer: 2000,
        });
        const newClass = await getClasses(selectedDay);
        setClasses(newClass);
        // reset();
        return;
      }
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Sorry, Could not add class",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleUpdate = (cls) => {
    reset(cls);
    setSelectedClass(cls);
    setShowModal(true);
  };

  const handleComplete = async (id) => {
    const result = await api.patch(`/update-class/completed/${id}`);
    if (result.data.modifiedCount) {
      const newClass = await getClasses(selectedDay);
      setClasses(newClass);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Marked the class as completed",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Something went Wrong!",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };
  const handleIncomplete = async (id) => {
    const result = await api.patch(`/update-class/incomplete/${id}`);

    if (result.data.modifiedCount) {
      const newClass = await getClasses(selectedDay);
      setClasses(newClass);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Marked the class as incomplete",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Something went Wrong!",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleDelete = async (id) => {
    const res = await api.delete(`/classes/${id}`);
    if (res.data.success) {
      const newClass = await getClasses(selectedDay);
      setClasses(newClass);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Successfully deleted the class. ",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Something went Wrong!",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4 mx-auto">
        {daysOfWeek.map((day) => (
          <NavLink
            key={day}
            to={`/class-scheduler/${day.toLowerCase()}`}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-center font-semibold transition-colors shadow-md ${
                isActive
                  ? "bg-[#e64524] text-white"
                  : "bg-[#23272F] text-white hover:bg-[#2C394B]"
              }`
            }
          >
            {day}
          </NavLink>
        ))}
      </div>
      <div className="flex justify-end ">
        <button
          className="py-2 px-3 bg-green-500 rounded-lg my-4 hover:bg-[#2C394B] "
          title="Add New Class"
          onClick={handleAddClass}
        >
          <MdLibraryAdd size={30} />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:ml-64 mt-40 bg-opacity-50">
          <div className="bg-[#23272F] border-1 border-green-500 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">Add New Class</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                {...register("subject")}
                placeholder="Subject"
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              />
              {errors.subject && (
                <span className="text-red-400 text-sm">
                  {errors.subject.message}
                </span>
              )}
              <input
                type="text"
                {...register("instructor")}
                placeholder="Instructor"
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              />
              {errors.instructor && (
                <span className="text-red-400 text-sm">
                  {errors.instructor.message}
                </span>
              )}
              <div className="flex gap-2">
                <input
                  type="time"
                  {...register("startTime")}
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white w-1/2"
                />
                <input
                  type="time"
                  {...register("endTime")}
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white w-1/2"
                />
              </div>
              {(errors.startTime || errors.endTime) && (
                <span className="text-red-400 text-sm">
                  {errors.startTime?.message || errors.endTime?.message}
                </span>
              )}
              <div className="flex items-center gap-2">
                <label className="text-white">Color:</label>
                <input
                  type="color"
                  {...register("color")}
                  defaultValue="#fff"
                  className="w-10 h-10 p-0 border-none"
                />
              </div>
              <textarea
                {...register("notes")}
                placeholder="Notes"
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white resize-none"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF4C29] text-white rounded-lg font-semibold hover:bg-[#e64524] transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show data in table */}
      <table className="min-w-full bg-[#23272F] rounded-lg shadow-md ">
        <thead>
          <tr className="bg-green-500 rounded-tl-2xl">
            <th className="py-2 px-4 text-white text-center">Subject</th>
            <th className="py-2 px-4 text-white text-center">Instructor</th>
            <th className="py-2 px-4 text-white text-center">Start Time</th>
            <th className="py-2 px-4 text-white text-center">End Time</th>
            <th className="py-2 px-4 text-white text-center">Notes</th>
            <th className="py-2 px-4 text-white text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 px-4 text-center text-gray-400">
                No classes scheduled for this day.
              </td>
            </tr>
          ) : (
            classes.map((cls) => (
              <tr key={cls._id} className={`border-b border-gray-700 hover:bg-[#131920]`}>
                <td
                  style={{ color: cls.color }}
                  className="py-2 px-4 font-bold text-center text-white"
                >
                  {cls.subject}
                </td>
                <td className="py-2 px-4 text-center text-white">
                  {cls.instructor}
                </td>
                <td className="py-2 px-4 text-center text-white">
                  {cls.startTime}
                </td>
                <td className="py-2 px-4 text-center text-white">
                  {cls.endTime}
                </td>
                <td className="py-2 px-4 text-center text-white">
                  {cls.notes || "-"}
                </td>
                <td className="py-2 px-4 text-center text-white">
                  {/* Example action buttons */}
                  <div className="flex justify-center gap-5">
                    <button
                      onClick={() => handleUpdate(cls, cls._id)}
                      className="px-2 py-1 bg-blue-600 rounded text-white mr-2 hover:bg-blue-500 text-xs"
                      title="Edit Class"
                    >
                      <AiFillEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(cls._id)}
                      className="px-2 py-1 bg-red-600 rounded text-white hover:bg-red-800 text-xs"
                      title="Delete Class"
                    >
                      <MdDeleteSweep size={20} />
                    </button>
                    {cls.status ? (
                      <>
                        <button
                          onClick={() => handleIncomplete(cls._id)}
                          className="px-2 py-1 bg-green-600 rounded text-white hover:bg-green-800 text-xs"
                          title="Mark as incomplete"
                        >
                          <FaRegCheckSquare size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleComplete(cls._id)}
                          className="px-2 py-1 bg-green-600 rounded text-white hover:bg-green-800 text-xs"
                          title="Mark as Complete"
                        >
                          <MdCheckBoxOutlineBlank size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default EachClass;
