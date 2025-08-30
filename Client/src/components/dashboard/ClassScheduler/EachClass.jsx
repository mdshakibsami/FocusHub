import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../utils/api";

async function addClass(classData) {
  const res = await api.post("/add-class", classData);
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
    async function getClasses(day) {
      const res = await api.get(`/classes/${day}`);
      setClasses(res.data);
      console.log("hi", res.data);
    }
    getClasses(selectedDay);
  }, [selectedDay,showModal]);

  const onSubmit = async (data) => {
    console.log(data);
    data.day = selectedDay;
    setShowModal(false);
    const res = await addClass(data);
    if (res.success) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Class added!",
        showConfirmButton: false,
        timer: 2000,
      });
      reset();
      return;
    }
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "Failed",
      title: "Something went Wrong!",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <>
      <div className="flex justify-end ">
        <button
          className="py-2 px-4 bg-[#e64524] rounded-lg my-4 hover:bg-[#2C394B]"
          onClick={handleAddClass}
        >
          Add Class
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:ml-64 mt-40 bg-opacity-50">
          <div className="bg-[#23272F] p-8 rounded-lg shadow-lg w-full max-w-md">
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
                  defaultValue="#e64524"
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
      <table className="min-w-full bg-[#23272F] rounded-lg shadow-md mt-6">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left text-white">Subject</th>
            <th className="py-2 px-4 text-left text-white">Instructor</th>
            <th className="py-2 px-4 text-left text-white">Start Time</th>
            <th className="py-2 px-4 text-left text-white">End Time</th>
            <th className="py-2 px-4 text-left text-white">Notes</th>
            <th className="py-2 px-4 text-left text-white">Action</th>
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
              <tr
                key={cls._id}
                className={`border-b border-gray-700 bg-[${cls.color}]`}
              >
                <td className="py-2 px-4 text-white">{cls.subject}</td>
                <td className="py-2 px-4 text-white">{cls.instructor}</td>
                <td className="py-2 px-4 text-white">{cls.startTime}</td>
                <td className="py-2 px-4 text-white">{cls.endTime}</td>
                <td className="py-2 px-4 text-white">{cls.notes || "-"}</td>
                <td className="py-2 px-4 text-white">
                  {/* Example action buttons */}
                  <button className="px-2 py-1 bg-blue-600 rounded text-white mr-2 hover:bg-blue-800 text-xs">
                    Edit
                  </button>
                  <button className="px-2 py-1 bg-red-600 rounded text-white hover:bg-red-800 text-xs">
                    Delete
                  </button>
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
