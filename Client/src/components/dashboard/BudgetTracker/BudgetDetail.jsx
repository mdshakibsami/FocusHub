import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../utils/api";
import { MdDeleteSweep, MdLibraryAdd } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";

const classSchema = z.object({
  title: z.string().min(2, "Title is required"),
  currency: z.string().min(1, "Currency is required"),
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
  const [transactionCount, setTransactionCount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Special technique developed by Md Shakib
  const [skCount, setSkCount] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(classSchema),
  });

  const allCurrency = [
    { code: "AED", name: "United Arab Emirates Dirham", symbol: "د.إ" },
    { code: "AFN", name: "Afghan Afghani", symbol: "؋" },
    { code: "ALL", name: "Albanian Lek", symbol: "L" },
    { code: "AMD", name: "Armenian Dram", symbol: "֏" },
    { code: "ANG", name: "Netherlands Antillean Guilder", symbol: "ƒ" },
    { code: "AOA", name: "Angolan Kwanza", symbol: "Kz" },
    { code: "ARS", name: "Argentine Peso", symbol: "$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "AWG", name: "Aruban Florin", symbol: "ƒ" },
    { code: "AZN", name: "Azerbaijani Manat", symbol: "₼" },
    {
      code: "BAM",
      name: "Bosnia-Herzegovina Convertible Mark",
      symbol: "KM",
    },
    { code: "BBD", name: "Barbadian Dollar", symbol: "Bds$" },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
    { code: "BGN", name: "Bulgarian Lev", symbol: "лв" },
    { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب" },
    { code: "BIF", name: "Burundian Franc", symbol: "FBu" },
    { code: "BMD", name: "Bermudian Dollar", symbol: "$" },
    { code: "BND", name: "Brunei Dollar", symbol: "B$" },
    { code: "BOB", name: "Bolivian Boliviano", symbol: "Bs." },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
    { code: "BSD", name: "Bahamian Dollar", symbol: "B$" },
    { code: "BTN", name: "Bhutanese Ngultrum", symbol: "Nu." },
    { code: "BWP", name: "Botswana Pula", symbol: "P" },
    { code: "BYN", name: "Belarusian Ruble", symbol: "Br" },
    { code: "BZD", name: "Belize Dollar", symbol: "BZ$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "CDF", name: "Congolese Franc", symbol: "FC" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CLP", name: "Chilean Peso", symbol: "$" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "COP", name: "Colombian Peso", symbol: "$" },
    { code: "CRC", name: "Costa Rican Colón", symbol: "₡" },
    { code: "CUP", name: "Cuban Peso", symbol: "$" },
    { code: "CVE", name: "Cape Verdean Escudo", symbol: "$" },
    { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
    { code: "DJF", name: "Djiboutian Franc", symbol: "Fdj" },
    { code: "DKK", name: "Danish Krone", symbol: "kr" },
    { code: "DOP", name: "Dominican Peso", symbol: "RD$" },
    { code: "DZD", name: "Algerian Dinar", symbol: "دج" },
    { code: "EGP", name: "Egyptian Pound", symbol: "£" },
    { code: "ERN", name: "Eritrean Nakfa", symbol: "Nfk" },
    { code: "ETB", name: "Ethiopian Birr", symbol: "Br" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "FJD", name: "Fijian Dollar", symbol: "FJ$" },
    { code: "FKP", name: "Falkland Islands Pound", symbol: "£" },
    { code: "GBP", name: "British Pound Sterling", symbol: "£" },
    { code: "GEL", name: "Georgian Lari", symbol: "₾" },
    { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
    { code: "GIP", name: "Gibraltar Pound", symbol: "£" },
    { code: "GMD", name: "Gambian Dalasi", symbol: "D" },
    { code: "GNF", name: "Guinean Franc", symbol: "FG" },
    { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q" },
    { code: "GYD", name: "Guyanese Dollar", symbol: "GY$" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
    { code: "HNL", name: "Honduran Lempira", symbol: "L" },
    { code: "HRK", name: "Croatian Kuna", symbol: "kn" },
    { code: "HTG", name: "Haitian Gourde", symbol: "G" },
    { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
    { code: "ILS", name: "Israeli New Shekel", symbol: "₪" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "IQD", name: "Iraqi Dinar", symbol: "ع.د" },
    { code: "IRR", name: "Iranian Rial", symbol: "﷼" },
    { code: "ISK", name: "Icelandic Króna", symbol: "kr" },
    { code: "JMD", name: "Jamaican Dollar", symbol: "J$" },
    { code: "JOD", name: "Jordanian Dinar", symbol: "JD" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
    { code: "KGS", name: "Kyrgyzstani Som", symbol: "с" },
    { code: "KHR", name: "Cambodian Riel", symbol: "៛" },
    { code: "KMF", name: "Comorian Franc", symbol: "CF" },
    { code: "KPW", name: "North Korean Won", symbol: "₩" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
    { code: "KWD", name: "Kuwaiti Dinar", symbol: "KD" },
    { code: "KYD", name: "Cayman Islands Dollar", symbol: "CI$" },
    { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸" },
    { code: "LAK", name: "Lao Kip", symbol: "₭" },
    { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل" },
    { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs" },
    { code: "LRD", name: "Liberian Dollar", symbol: "L$" },
    { code: "LSL", name: "Lesotho Loti", symbol: "L" },
    { code: "LYD", name: "Libyan Dinar", symbol: "LD" },
    { code: "MAD", name: "Moroccan Dirham", symbol: "DH" },
    { code: "MDL", name: "Moldovan Leu", symbol: "L" },
    { code: "MGA", name: "Malagasy Ariary", symbol: "Ar" },
    { code: "MKD", name: "Macedonian Denar", symbol: "ден" },
    { code: "MMK", name: "Burmese Kyat", symbol: "K" },
    { code: "MNT", name: "Mongolian Tögrög", symbol: "₮" },
    { code: "MOP", name: "Macanese Pataca", symbol: "MOP$" },
    { code: "MRU", name: "Mauritanian Ouguiya", symbol: "UM" },
    { code: "MUR", name: "Mauritian Rupee", symbol: "₨" },
    { code: "MVR", name: "Maldivian Rufiyaa", symbol: "Rf" },
    { code: "MWK", name: "Malawian Kwacha", symbol: "MK" },
    { code: "MXN", name: "Mexican Peso", symbol: "$" },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
    { code: "MZN", name: "Mozambican Metical", symbol: "MT" },
    { code: "NAD", name: "Namibian Dollar", symbol: "N$" },
    { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
    { code: "NIO", name: "Nicaraguan Córdoba", symbol: "C$" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
    { code: "NPR", name: "Nepalese Rupee", symbol: "₨" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
    { code: "OMR", name: "Omani Rial", symbol: "﷼" },
    { code: "PAB", name: "Panamanian Balboa", symbol: "B/." },
    { code: "PEN", name: "Peruvian Sol", symbol: "S/" },
    { code: "PGK", name: "Papua New Guinean Kina", symbol: "K" },
    { code: "PHP", name: "Philippine Peso", symbol: "₱" },
    { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
    { code: "PLN", name: "Polish Złoty", symbol: "zł" },
    { code: "PYG", name: "Paraguayan Guaraní", symbol: "₲" },
    { code: "QAR", name: "Qatari Rial", symbol: "﷼" },
    { code: "RON", name: "Romanian Leu", symbol: "lei" },
    { code: "RSD", name: "Serbian Dinar", symbol: "din" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽" },
    { code: "RWF", name: "Rwandan Franc", symbol: "FRw" },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
    { code: "SBD", name: "Solomon Islands Dollar", symbol: "SI$" },
    { code: "SCR", name: "Seychellois Rupee", symbol: "₨" },
    { code: "SDG", name: "Sudanese Pound", symbol: "ج.س" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "SHP", name: "Saint Helena Pound", symbol: "£" },
    { code: "SLL", name: "Sierra Leonean Leone", symbol: "Le" },
    { code: "SOS", name: "Somali Shilling", symbol: "Sh.So." },
    { code: "SRD", name: "Surinamese Dollar", symbol: "SRD$" },
    { code: "SSP", name: "South Sudanese Pound", symbol: "£" },
    { code: "STN", name: "São Tomé and Príncipe Dobra", symbol: "Db" },
    { code: "SVC", name: "Salvadoran Colón", symbol: "₡" },
    { code: "SYP", name: "Syrian Pound", symbol: "£S" },
    { code: "SZL", name: "Swazi Lilangeni", symbol: "E" },
    { code: "THB", name: "Thai Baht", symbol: "฿" },
    { code: "TJS", name: "Tajikistani Somoni", symbol: "ЅM" },
    { code: "TMT", name: "Turkmenistani Manat", symbol: "T" },
    { code: "TND", name: "Tunisian Dinar", symbol: "DT" },
    { code: "TOP", name: "Tongan Paʻanga", symbol: "T$" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺" },
    { code: "TTD", name: "Trinidad and Tobago Dollar", symbol: "TT$" },
    { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$" },
    { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
    { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
    { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
    { code: "USD", name: "United States Dollar", symbol: "$" },
    { code: "UYU", name: "Uruguayan Peso", symbol: "$U" },
    { code: "UZS", name: "Uzbekistani Som", symbol: "so'm" },
    { code: "VES", name: "Venezuelan Bolívar", symbol: "Bs.S" },
    { code: "VND", name: "Vietnamese Đồng", symbol: "₫" },
    { code: "VUV", name: "Vanuatu Vatu", symbol: "VT" },
    { code: "WST", name: "Samoan Tala", symbol: "WS$" },
    { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" },
    { code: "XCD", name: "East Caribbean Dollar", symbol: "EC$" },
    { code: "XOF", name: "West African CFA Franc", symbol: "CFA" },
    { code: "XPF", name: "CFP Franc", symbol: "₣" },
    { code: "YER", name: "Yemeni Rial", symbol: "﷼" },
    { code: "ZAR", name: "South African Rand", symbol: "R" },
    { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK" },
    { code: "ZWL", name: "Zimbabwean Dollar", symbol: "Z$" },
  ];

  const handleTransaction = () => {
    setShowModal(true);
  };

  useEffect(() => {
    (async () => {
      const allTransaction = await api.get("/all-transactions");
      setTransactions(allTransaction.data);
    })();
    (async () => {
      const getTransactionCount = await api.get("/transaction-count");
      const countObject = getTransactionCount.data.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});
      setTransactionCount(countObject);
    })();
  }, [showModal, skCount]);

  //==============================
  const onSubmit = async (data) => {
    console.log(data);
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
        setSkCount(skCount - 1);
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

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <div
            className="py-2 px-3 bg-green-600 rounded-lg my-4"
            title="Add New Class"
          >
            <h1 className="font-bold">
              Total Incomes :
              {transactionCount && <> {transactionCount.Income}</>}
            </h1>
          </div>

          <div
            className="py-2 px-3 bg-red-600 rounded-lg my-4"
            title="Add New Class"
          >
            <h1 className="font-bold">
              Total Incomes :
              {transactionCount && <> {transactionCount.Expense}</>}
            </h1>
          </div>
        </div>
        <button
          className="py-2 px-3 bg-green-500 rounded-lg my-4 hover:bg-[#2C394B] "
          title="Add New Class"
          onClick={handleTransaction}
        >
          <MdLibraryAdd size={30} />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed  inset-0 z-50 flex items-center justify-center sm:ml-64 mt-20 bg-opacity-50">
          <div className="bg-[#23272F]  border-1 border-green-500 p-8 rounded-lg shadow-lg w-full max-w-md">
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

              {/* Currency */}
              <select
                {...register("currency")}
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              >
                <option className="bg-[#23272f]" value="">
                  Select Currency
                </option>
                {allCurrency.map((c) => (
                  <option
                    className="bg-[#23272f]"
                    key={c.code}
                    value={c.symbol}
                  >
                    {c.code} - {c.symbol}
                  </option>
                ))}
              </select>
              {errors.currency && (
                <span className="text-red-400 text-sm">
                  {errors.currency.message}
                </span>
              )}

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
      <table className="min-w-full bg-[#23272F] rounded-lg shadow-md ">
        <thead>
          <tr className="bg-green-500 rounded-tl-2xl">
            <th className="py-2 px-4 text-white text-center">Title</th>
            <th className="py-2 px-4 text-white text-center">Date</th>
            <th className="py-2 px-4 text-white text-center">
              Transaction Type
            </th>
            <th className="py-2 px-4 text-white text-center">Amount</th>
            <th className="py-2 px-4 text-white text-center">Note</th>
            <th className="py-2 px-4 text-white text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 px-4 text-center text-gray-400">
                No classes scheduled for this day.
              </td>
            </tr>
          ) : (
            transactions.map((tra) => (
              <tr
                key={tra._id}
                className={`border-b border-gray-700 hover:bg-[#131920]`}
              >
                <td
                  className={`${
                    tra.type === "Income" ? "text-green-500" : "text-red-500"
                  } py-2 px-4 font-bold text-center`}
                >
                  {tra.title}
                </td>
                <td className="py-2 px-4 text-center text-white">{tra.date}</td>
                <td
                  className={`py-2 px-4 text-center ${
                    tra.type === "Income" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {tra.type}
                </td>
                <td className="py-2 px-4 text-center text-white">
                  {`${tra.amount} ${tra.currency}`}
                </td>
                <td className="py-2 px-4 text-center text-white">
                  {tra.note || "N/A"}
                </td>
                <td className="py-2 px-4 text-center text-white">
                  {/* Example action buttons */}
                  <div className="flex justify-center gap-5">
                    <button
                      onClick={() => handleUpdate(tra, tra._id)}
                      className="px-2 py-1 bg-blue-600 rounded text-white mr-2 hover:bg-blue-500 text-xs"
                      title="Edit Class"
                    >
                      <AiFillEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(tra._id)}
                      className="px-2 py-1 bg-red-600 rounded text-white hover:bg-red-800 text-xs"
                      title="Delete Class"
                    >
                      <MdDeleteSweep size={20} />
                    </button>
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

export default BudgetDetail;
