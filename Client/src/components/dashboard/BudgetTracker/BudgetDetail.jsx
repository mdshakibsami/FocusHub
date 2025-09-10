import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../utils/api";
import { MdDeleteSweep, MdLibraryAdd } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";

const getAllTransaction = async (type) => {
  const res = await api.get(`/all-transactions/${type}`);
  return res.data;
};

const classSchema = z.object({
  title: z.string().min(2, "Title is required"),
  type: z.string().min(1, "Type is required"),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().min(0.01, "Amount is required and must be positive")
  ),
  date: z.string().min(1, "Date is required"),
  note: z.string().optional(),
});

const BudgetDetail = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectType, setSelectType] = useState("All");
  // Special technique developed by Md Shakib
  const [skCount, setSkCount] = useState(0);
  //==========================================================
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(classSchema),
  });

  //============== Initial, Add, Update, Delete ==============
  const handleTransaction = () => {
    setShowModal(true);
  };
  useEffect(() => {
    (async () => {
      const allTransaction = await getAllTransaction(selectType);
      setTransactions(allTransaction);
    })();
    (async () => {
      const getTransactionCount = await api.get("/transaction-count");
      const countObject = getTransactionCount.data.reduce((acc, item) => {
        acc[item._id] = item.totalAmount;
        return acc;
      }, {});
      setTransactionAmount(countObject);
    })();
  }, [showModal, skCount, selectType]);

  const onSubmit = async (data) => {
    setShowModal(false);
    if (selectedTransactions?._id) {
      const res = await api.put(
        `/update-transaction/${selectedTransactions?._id}`,
        data
      );
      if (res.data.modifiedCount) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Class is modified.",
          showConfirmButton: false,
          timer: 2000,
        });
        reset();
        setSkCount(skCount - 1);
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
      setSelectedTransactions(null);
    } else {
      const res = await api.post("/add-transaction", data);
      if (res.data.insertedId) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Transaction is added!",
          showConfirmButton: false,
          timer: 2000,
        });

        // reset();
        setSkCount(skCount + 1);

        return;
      }
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Sorry, Something is wrong!",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleUpdate = (tra) => {
    reset(tra);
    setSelectedTransactions(tra);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const res = await api.delete(`/transaction/${id}`);
    if (res.data.success) {
      setSkCount(skCount - 1);
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
  //==========================================================
  // ================ Search and Select ======================

  const handleTypeChange = (e) => {
    setSelectType(e.target.value);
  };
  //==========================================================
  // ====================== Charts ===========================
  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [transactionAmount?.Income || 0, transactionAmount?.Expense || 0],
        backgroundColor: ["#29c76e", "#FF4C29"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: { size: 16 },
        },
      },
    },
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 p-2 sm:p-4 md:p-8 min-h-[300px] bg-gradient-to-br from-[#23272f] via-[#334756] to-[#5C7AEA] rounded-2xl">
        <div className="flex flex-col justify-start items-start pr-0 md:pr-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-green-500 mb-2">
            Money Management Matters
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mb-2 text-justify">
            Effective money management is the foundation of financial success.
            It allows you to take control of your finances instead of letting
            money control you. By carefully tracking your income and expenses,
            you gain a clear picture of where your money is going. This
            awareness helps you identify unnecessary spending and focus on what
            truly matters. Setting short-term and long-term financial goals
            gives you direction and purpose. With goals in place, you can save
            consistently, invest wisely, and prepare for unexpected situations.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch gap-4">
          <div className="flex flex-col mt-4 justify-center h-full gap-4">
            <div
              className="py-3 px-4 bg-gradient-to-r from-green-600 to-green-400 rounded-xl flex items-center justify-center shadow-md"
              title="Total Income"
            >
              <h1 className="font-bold text-center text-white text-base sm:text-lg">
                Total Incomes :
                {transactionAmount && (
                  <span className="ml-2">
                    {transactionAmount.Income || 0} ৳
                  </span>
                )}
              </h1>
            </div>
            <div
              className="py-3 px-4 bg-gradient-to-r from-red-600 to-red-400 rounded-xl flex items-center justify-center shadow-md"
              title="Total Expense"
            >
              <h1 className="font-bold text-center text-white text-base sm:text-lg">
                Total Expenses :
                {transactionAmount && (
                  <span className="ml-2">
                    {transactionAmount.Expense || 0} ৳
                  </span>
                )}
              </h1>
            </div>
            <div
              className="py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-md"
              title="Net Total"
            >
              <h1 className="font-bold text-center text-white text-base sm:text-lg">
                Total Amount :
                {transactionAmount && (
                  <span className="ml-2">
                    {parseInt(transactionAmount.Income || 0) -
                      parseInt(transactionAmount.Expense || 0)}
                    ৳
                  </span>
                )}
              </h1>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center h-full">
            {transactionAmount && (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 text-center">
                  Income vs Expense
                </h2>
                <div
                  className="bg-[#23272f] rounded-2xl border-2 border-green-400 shadow-xl p-2 sm:p-4 flex items-center justify-center w-full"
                  style={{ maxWidth: 220, height: "auto" }}
                >
                  <Pie
                    data={pieData}
                    options={{ ...pieOptions, maintainAspectRatio: false }}
                    width={160}
                    height={160}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <hr className="mt-2" />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-4">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Select Income/Expense */}
          <select
            className="py-2 px-3 rounded-lg border border-gray-400 bg-[#23272f] text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => handleTypeChange(e)}
          >
            <option value="All">All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div>
          <button
            className="py-2 px-3 bg-green-500 rounded-xl my-2 sm:my-4 hover:bg-green-600 shadow transition-colors"
            title="Add New Transaction"
            onClick={handleTransaction}
          >
            <MdLibraryAdd size={24} />
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
          <div className="bg-[#23272F] border border-green-500 p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md mx-2">
            <h2 className="text-xl font-bold mb-4 text-white">
              Add Transaction
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Product / Expense Title */}
              <input
                type="text"
                {...register("title")}
                placeholder="Product / Expense Title"
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              />
              {errors.title && (
                <span className="text-red-400 text-sm">
                  {errors.title.message}
                </span>
              )}

              {/* Type: Income / Expense */}
              <select
                {...register("type")}
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              >
                <option className="bg-[#23272f]" value="Income">
                  Income
                </option>
                <option className="bg-[#23272f]" value="Expense">
                  Expense
                </option>
              </select>

              {/* Amount */}
              <input
                type="number"
                {...register("amount")}
                placeholder="Amount"
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              />
              {errors.amount && (
                <span className="text-red-400 text-sm">
                  {errors.amount.message}
                </span>
              )}

              {/* Date Picker - default to current date */}
              <input
                type="date"
                {...register("date")}
                defaultValue={new Date().toISOString().split("T")[0]}
                className="px-3 py-2 rounded-md border border-gray-300 bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.date && (
                <span className="text-red-400 text-sm">
                  {errors.date.message}
                </span>
              )}

              {/* Note */}
              <textarea
                {...register("note")}
                placeholder="Note"
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white resize-none"
                rows={3}
              />

              {/* Buttons */}
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

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-[#23272F] rounded-xl shadow border border-gray-800 text-xs sm:text-sm">
          <thead>
            <tr className="bg-green-500 rounded-t-xl">
              <th className="py-2 px-1 sm:px-4 text-white text-center">
                Title
              </th>
              <th className="py-2 px-1 sm:px-4 text-white text-center">Date</th>
              <th className="py-2 px-1 sm:px-4 text-white text-center">Type</th>
              <th className="py-2 px-1 sm:px-4 text-white text-center">
                Amount
              </th>
              <th className="py-2 px-1 sm:px-4 text-white text-center">Note</th>
              <th className="py-2 px-1 sm:px-4 text-white text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-4 px-4 text-center text-gray-400 text-xs"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tra) => (
                <tr
                  key={tra._id}
                  className="border-b border-gray-800 hover:bg-[#181a20] transition-colors"
                >
                  <td
                    className={`${
                      tra.type === "Income" ? "text-green-500" : "text-red-500"
                    } py-2 px-1 sm:px-4 font-bold text-center`}
                  >
                    {tra.title}
                  </td>
                  <td className="py-2 px-1 sm:px-4 text-center text-white">
                    {tra.date}
                  </td>
                  <td
                    className={`py-2 px-1 sm:px-4 text-center ${
                      tra.type === "Income" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {tra.type}
                  </td>
                  <td className="py-2 px-1 sm:px-4 text-center text-white">
                    {tra.amount} ৳
                  </td>
                  <td className="py-2 px-1 sm:px-4 text-center text-white">
                    {tra.note || "N/A"}
                  </td>
                  <td className="py-2 px-1 sm:px-4 text-center text-white">
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-1 sm:gap-2 items-center">
                      <button
                        onClick={() => handleUpdate(tra, tra._id)}
                        className="p-1 bg-blue-600 rounded hover:bg-blue-500 text-white"
                        title="Edit Transaction"
                      >
                        <AiFillEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(tra._id)}
                        className="p-1 bg-red-600 rounded hover:bg-red-800 text-white"
                        title="Delete Transaction"
                      >
                        <MdDeleteSweep size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BudgetDetail;
