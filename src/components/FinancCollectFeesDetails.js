import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import CustomSelect from "../commonComponent/CustomSelect";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  capitalizeWords,
  feeduration,
} from "../commonComponent/CommonFunctions";
import { getData } from "../app/api";
import { FEES } from "../app/url";
import CustomInput from "../commonComponent/CustomInput";
import { FieldArray } from "formik";

function FinancCollectFeesDetails({ feeData, values, setFieldValue }) {
  const [fees, setFees] = useState([]);
  const [newRows, setNewRow] = useState([]);
  const [allFees, setAllFees] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // console.log("Redux fees data only:", reduxFees);
  // console.log("allFees:",allFees);

  const getFeesData = async () => {
    try {
      const response = await getData(FEES);
      if (response.data) {
        const feesData = response.data.data.map((item) => ({
          name: item.name,
          _id: item._id,
          amount: item.amount,
          feeInstallment: item.feeInstallment,
        }));
        setAllFees(feesData);
      }
    } catch (error) {
      console.error("Failed to fetch fees data:", error);
    }
  };

  const totalAmount = values.fees.reduce(
    (total, fee) => total + Number(fee.payAmnt),
    0
  );
  const totalAmountTobepay = totalAmount - (Number(values.discountAmnt) || 0);

  useEffect(() => {
    setFieldValue("totalPayAmnt", totalAmountTobepay);
  }, [totalAmountTobepay, values.fees, values.discountAmnt, setFieldValue]);

  useEffect(() => {
    getFeesData();
  }, []);

  const handleAddFee = (fee) => {
    const newFee = {
      _id: fee._id,
      feeName: fee.name.toUpperCase(),
      feeInstallment: fee.feeInstallment,
      // feeInstallment:duration,
      amount: fee.amount,
      instalmentAmount: fee.amount,
      disCount: "",
      paidAmount: 0,
      dueDate: "",
      status: "",
      payAmnt: "",
    };

    let dummyList = [...values.fees, newFee];
    console.log("dummy list :", dummyList);
    setNewRow([...newRows, newFee._id]);
    setFieldValue("fees", dummyList);

    setShowDropdown(false);
  };

  const handleRemove = (feeId) => {
    const updatedFees = values.fees.filter((fee) => fee._id !== feeId);
    setFieldValue("fees", updatedFees); // Update Formik state
    setNewRow(newRows.filter((id) => id !== feeId)); // Remove ID from newRows
  };

  return (
    <>
      <div className="px-4 py-4 text-sm/6">
        <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
          <thead className="bg-purple-100">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
              >
                <a href="#" className="group inline-flex">
                  Fee Name
                </a>
              </th>

              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Duration
                </a>
              </th>
              <th
                scope="col"
                className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Total Fee
                </a>
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  One Time Discount
                </a>
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Paid Amount
                </a>
              </th>

              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Pending Balance
                </a>
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Due Date
                </a>
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Status
                </a>
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Now Paid
                </a>
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              ></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <FieldArray name="fees">
              {() =>
                values.fees.map((fee, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {capitalizeWords(fee.feeName)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {newRows.includes(fee._id) ? (
                        <div className="sm:col-span-1">
                          <CustomSelect
                            name={`fees.${fee._id}.feeInstallment`} // Dynamically bind the name
                            placeholder="duration"
                            options={feeduration}
                            value={
                              values.fees.find((f) => f._id === fee._id)
                                ?.feeInstallment || fee.feeInstallment
                            } // Reflect state or fallback to fee.feeInstallment
                            onChange={(e) => {
                              const duration = Number(e.target.value);
                              const updatedFees = values.fees.map((f) =>
                                f._id === fee._id
                                  ? { ...f, feeInstallment: duration }
                                  : f
                              );
                              setFieldValue("fees", updatedFees); // Update the fees array in Formik state
                            }}
                          />
                        </div>
                      ) : (
                        `${fee.feeInstallment} installment`
                      )}
                    </td>

                    {/* <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {newRows.includes(fee._id) ? (
                        <input
                          type="text"
                          value={
                            values.fees.find((f) => f._id === fee._id)
                              ?.amount || fee.amount
                          } // Bind to Formik's state
                          onChange={(e) => {
                            const updatedValue = Number(e.target.value);
                            const updatedFees = values.fees.map((f) =>
                              f._id === fee._id
                                ? { ...f, amount: updatedValue }
                                : f
                            );
                            setFieldValue("fees", updatedFees); // Update the fees array in Formik state
                          }}
                          className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                        />
                      ) : (
                        fee.amount
                      )}
                    </td> */}

                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {newRows.includes(fee._id) ? (
                        <input
                          type="text"
                          value={
                            values.fees.find((f) => f._id === fee._id)
                              ?.amount || fee.amount
                          } // Bind to Formik's state
                          onChange={(e) => {
                            const updatedValue = Number(e.target.value);
                            const updatedFees = values.fees.map((f) =>
                              f._id === fee._id
                                ? {
                                    ...f,
                                    amount: updatedValue,
                                    instalmentAmount: updatedValue,
                                  }
                                : f
                            );
                            setFieldValue("fees", updatedFees); // Update the fees array in Formik state
                          }}
                          className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                        />
                      ) : (
                        fee.amount
                      )}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {newRows.includes(fee._id) ? (
                        <input
                          type="text"
                          name="feeTitle"
                          placeholder="Enter"
                          className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                        />
                      ) : (
                        fee.amount - fee.instalmentAmount
                      )}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {fee.paidAmount}
                    </td>
                    {/* <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {fee.instalmentAmount}
                    </td> */}
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {newRows.includes(fee._id) ? (
                        <span>
                          {values.fees.find((f) => f._id === fee._id)
                            ?.instalmentAmount || fee.instalmentAmount}
                        </span>
                      ) : (
                        fee.instalmentAmount
                      )}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {fee.dueDate}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {newRows.includes(fee._id) ? (
                        ""
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          {fee.status}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <div className="sm:col-span-1">
                        <CustomInput
                          name={`fees[${index}].payAmnt`}
                          className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                        />
                      </div>
                    </td>
                    {newRows.includes(fee._id) && (
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        <button onClick={() => handleRemove(fee._id)}>
                          <XMarkIcon
                            aria-hidden="true"
                            className="text-red-500 size-5"
                          />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              }
            </FieldArray>

            <tr>
              <td>
                <button
                  type="button"
                  className="inline-flex items-center  px-3 py-2 text-sm font-semibold text-purple-500  "
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
                  Add New
                </button>
                {/* {showDropdown && (
                  <ul className="border rounded shadow-md mt-2 bg-white">
                    {allFees.map((fee, index) => (
                      <li
                        key={index}
                        className={`px-4 py-2 cursor-pointer ${
                          fees.some((f) => f.value === fee.value)
                            ? "bg-gray-300"
                            : "hover:bg-gray-200"
                        }`}
                        onClick={() => handleAddFee(fee)}
                      >
                        {fee.name}
                      </li>
                    ))}
                  </ul>
                )} */}
                {showDropdown && (
                  <ul className="border rounded shadow-md mt-2 bg-white">
                    {allFees
                      .filter(
                        (fee) =>
                          !values.fees.some(
                            (selectedFee) => selectedFee._id === fee._id
                          )
                      )
                      .map((fee, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleAddFee(fee)}
                        >
                          {fee.name}
                        </li>
                      ))}
                  </ul>
                )}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-right">
                Total Pending:
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-left">
                ₹
                {values.fees.reduce(
                  (total, fee) => total + fee.instalmentAmount,
                  0
                )}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-right">
                Currently Received:
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-left">
                {totalAmount}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-right">
                Special Discount:
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-right">
                <CustomSelect
                  name="discountFees"
                  options={allFees.map((fee) => ({
                    label: fee.name,
                    value: fee.value,
                  }))}
                />
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <div className="sm:col-span-1">
                  <CustomInput
                    name="discountAmnt"
                    className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-right">
                Total Paid:
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-left">
                {totalAmountTobepay}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FinancCollectFeesDetails;
