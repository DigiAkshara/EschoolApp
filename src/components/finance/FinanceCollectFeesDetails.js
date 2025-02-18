import { PlusIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { jsPDF } from "jspdf"; // For PDF generation
import { Dialog, Transition } from "@headlessui/react"; // For modal transitions
import { Fragment } from "react"; // Required for <Fragment>

import { FieldArray, Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { getData, postData } from "../../app/api";
import { FEES, STUDENT_FEE } from "../../app/url";
import autoTable from "jspdf-autotable";

import {
  banks,
  capitalizeWords,
  feeduration,
  handleApiResponse,
  payments,
  uploadFile,
} from "../../commonComponent/CommonFunctions";
import CustomDate from "../../commonComponent/CustomDate";
import CustomFileUploader from "../../commonComponent/CustomFileUploader";
import CustomInput from "../../commonComponent/CustomInput";
import CustomSelect from "../../commonComponent/CustomSelect";

function FinancCollectFeesDetails({ onClose, fetchData }) {
  const [allFees, setAllFees] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const selectedData = useSelector((state) => state.fees.selectedFee);
  const classId = selectedData?.academic.class._id;
  const selectedFee = selectedData?.fees;
  const studentData = selectedData?.academic;
  const feesData = selectedFee?.feeList;
  const tenant = useSelector((state) => state.tenantData);
  const branchId = useSelector((state) => state.appConfig.branchId);

  const getInitialValues = () => {
    return {
      studentId: selectedData?.fees.student,
      fees: selectedFee?.feeList.map((item) => {
        const pendingAmount =
          (item.paybalAmount * 1 || 0) - (item.paidAmount * 1 || 0);
        return {
          _id: item.fee._id,
          feeName: item.fee.name,
          duration: item.duration,
          totalAmount: item.fee.amount * 1,
          discount: item.discount * 1 || 0,
          paybalAmount: item.paybalAmount,
          paidAmount: item.paidAmount * 1 || 0,
          pendingAmount: pendingAmount,
          dueDate: item.dueDate || null,
          status: item.paymentStatus
            ? capitalizeWords(item.paymentStatus)
            : "Pending",
          paymentAmount: 0,
        };
      }),
      transactionDate: "",
      paymentMode: "",
      bank: "",
      transactionId: "",
      transactionProof: "",
      totalPaymentAmount: "",
    };
  };
  const getValidationSchema = () => {
    return Yup.object({
      fees: Yup.array()
        .of(
          Yup.object({
            discount: Yup.number().test(
              "if-value-is-exist-must-be-less-than-or-equalto-total-amount",
              "Discount cannot be greater than total amount",
              function (value) {
                const { totalAmount } = this.parent; // Access sibling field 'total amount'
                if (value && value * 1 > (totalAmount * 1) / 4) {
                  return false; // Fail validation if discount is greater than total amount
                }
                return true; // Pass validation otherwise
              }
            ),
            duration: Yup.string().required("Duration is required"),
            totalAmount: Yup.number().required("Total Amount is required"),
            dueDate: Yup.date().nullable().required("Due Date is required"),
            paymentAmount: Yup.number().test(
              "if-value-is-exist-must-be-less-than-or-equalto-pending-amount",
              "Amount cannot be greater than pending amount",
              function (value) {
                const { pendingAmount } = this.parent; // Access sibling field 'pending amount'
                if (value && value * 1 > pendingAmount * 1) {
                  return false; // Fail validation if paymentMode is not 'cash' but value is invalid
                }
                return true; // Pass validation otherwise
              }
            ),
          })
        )
        .test(
          "at-least-one-amount-must-be-entered",
          "At least one amount must be pay",
          (items) =>
            items.some((item) => item.paymentAmount && item.paymentAmount > 0)
        ),
      transactionDate: Yup.date()
        .nullable()
        .required("Transaction Date is required"),
      paymentMode: Yup.string().required("Payment Mode is required"),
      bank: Yup.string().test(
        "is-bank-is-not-cash",
        "School Credit Bank is required",
        function (value) {
          const { paymentMode } = this.parent; // Access sibling field 'paymentMode'
          if (paymentMode !== "cash" && !value) {
            return false; // Fail validation if paymentMode is not 'cash' but value is invalid
          }
          return true; // Pass validation otherwise
        }
      ),
      transactionId: Yup.string().test(
        "is-bank-is-not-cash",
        "Transaction Id is required",
        function (value) {
          const { paymentMode } = this.parent; // Access sibling field 'paymentMode'
          if (paymentMode !== "cash" && !value) {
            return false; // Fail validation if paymentMode is not 'cash' but value is invalid
          }
          return true; // Pass validation otherwise
        }
      ),
      transactionProof: Yup.object().nullable(),
    });
  };
  const getFeesData = async () => {
    try {
      const res = await getData(FEES);
      const feeRes = res.data.data;
      let dummyList = feeRes.filter(
        (item) => item.isGlobal || item.class?._id === classId
      );
      setAllFees(dummyList);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const handleAddFee = (item, fees, setFieldValue) => {
    const newFee = {
      _id: item._id,
      feeName: item.name,
      duration: item.duration,
      totalAmount: item.amount * 1,
      discount: 0,
      paybalAmount: item.amount * 1,
      paidAmount: 0,
      pendingAmount: item.amount * 1,
      dueDate: item.dueDate || null,
      status: "Pending",
      paymentAmount: 0,
      isAdded: true,
    };

    let dummyList = [...fees, newFee];
    setFieldValue("fees", dummyList);
    setShowDropdown(false);
  };

  const handleRemove = (feeId, fees, setFieldValue) => {
    const updatedFees = fees.filter((fee) => fee._id !== feeId);
    setFieldValue("fees", updatedFees); // Update Formik state
  };

  const handleFileChange = async (e, setFieldValue) => {
    try {
      const file = e.target.files[0]; // Get the first selected file
      if (file) {
        const fileResponse = await uploadFile(file); // Upload the file
        setFieldValue(e.target.name, fileResponse); // Update the form field with the response
      }
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const generateReceiptPDF = (
    data,
    logoUrl,
    orientation = "portrait",
    save = false
  ) => {
    const defaultLogo = "./schoolLogo.jpg";
    const doc = new jsPDF(orientation, "mm", "a4");
    doc.setFont("helvetica", "bold");

    const centerX = orientation === "landscape" ? 148 : 105;

    // **Header Section**
    doc.addImage(logoUrl || defaultLogo, "PNG", 10, 5, 28, 28);
    doc.setFontSize(14);
    doc.text((data.tenant?.name || "School Name").toUpperCase(), centerX, 15, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.text(
      `Phone: ${data.tenant?.phoneNumber || "N/A"} | Email: ${
        data.tenant?.email || "N/A"
      }`,
      centerX,
      21,
      { align: "center" }
    );
    doc.text(
      `Address: ${data.tenant?.city || "N/A"}, ${
        data.tenant?.district || "N/A"
      }, ${data.tenant?.state || "N/A"}, ${data.tenant?.pincode || "N/A"}`,
      centerX,
      27,
      { align: "center" }
    );
    doc.line(10, 35, orientation === "landscape" ? 290 : 200, 35);

    // **Receipt Title**
    doc.setFontSize(16);
    doc.text("FEE RECEIPT", centerX, 45, { align: "center" });

    // **Student & Fee Details**
    let detailsStartY = 55;
    doc.setFontSize(12);
    doc.text(`Receipt No: ${data?.receiptNo || "N/A"}`, 20, detailsStartY);
    doc.text(
      `Date: ${moment(data?.date || new Date()).format("DD-MM-YYYY")}`,
      140,
      detailsStartY
    );

    doc.text(`Student Name: ${data?.name || "N/A"}`, 20, detailsStartY + 10);
    doc.text(
      `Class & Section: ${data?.classSection || "N/A"}`,
      140,
      detailsStartY + 10
    );
    doc.text(
      `Admission No: ${data?.admissionNo || "N/A"}`,
      20,
      detailsStartY + 20
    );
    doc.text(`Roll No: ${data?.rollNo || "N/A"}`, 140, detailsStartY + 20);

    doc.text(
      `Academic Year: ${data?.academicYear || "N/A"}`,
      20,
      detailsStartY + 30
    );
    doc.text(`Branch: ${data?.branch || "N/A"}`, 140, detailsStartY + 30);

    doc.text(
      `Father's Name: ${data?.fatersName || "N/A"}`,
      20,
      detailsStartY + 40
    );
    doc.text(
      `Mother's Name: ${data?.mothersName || "N/A"}`,
      140,
      detailsStartY + 40
    );

    // doc.text(`Amount Paid: ₹${data?.amount || "0"}`, 20, detailsStartY + 50);
    // doc.text(`Total Paid: ₹${data?.amount || "0"}`, 140, detailsStartY + 50);
    // doc.text(`Balance: ₹${data?.balance || "0"}`, 20, detailsStartY + 60);

    // **Fee Breakdown Table**
    const tableStartY = detailsStartY + 50;
    const tableColumns = ["Si.No", "Fee Type", "Amount"];
    const tableData = (data?.feesDatas || []).map((fee, index) => [
      index + 1,
      fee?.feeName || "N/A",
      `${fee?.amount || "0"}`,
    ]);

    autoTable(doc, {
      startY: tableStartY,
      head: [tableColumns],
      body: tableData.length
        ? tableData
        : [[1, "No fee details available", "₹0"]],
      theme: "grid",
      headStyles: { fillColor: [206, 175, 240] },
      styles: { fontSize: 10 },
    });

    const totalPaidAmount = 5000; // Example static value
    const pendingBalance = 2000; // Example static value

    // Function to convert amount to words (basic implementation)
    const numberToWords = (num) => {
      const words = require("number-to-words");
      return words.toWords(num).toUpperCase();
    };

    const paidAmount = data?.amount || 0; // Ensure a default value of 0
    const pending = data?.pendingAmount || 0; // Ensure a default value of 0

    // Convert amount to words safely
    const totalPaidAmountInWords = numberToWords(paidAmount) + " ONLY";

    // Calculate pending amount safely
    const pendingAmount = pending - paidAmount;

    // Get the final Y position after the table
    const finalY = doc.lastAutoTable.finalY + 10; // Adding some spacing below table

    // Add Total Paid Amount, Amount in Words, and Pending Balance below the table

    doc.text(`Total Paid Amount: ${paidAmount || "N/A"}`, 20, finalY);
    doc.text(
      `Total Paid Amount In Words: ${totalPaidAmountInWords || "N/A"}`,
      20,
      finalY + 10
    );
    doc.text(`Pending Amount: ${pendingAmount || "N/A"}`, 20, finalY + 20);

    // **Footer Section**
    const footerY = doc.previousAutoTable.finalY + 40;
    doc.line(10, footerY, orientation === "landscape" ? 290 : 200, footerY);
    doc.setFontSize(10);

    // "Thank you for your payment!"
    doc.text("Thank you for your payment!", centerX, footerY + 10, {
      align: "center",
    });

    // **Accountant, Authorized Signature, Parent Signature in the same row**
    const signatureY = footerY + 30;
    const pageWidth = doc.internal.pageSize.getWidth();
    const sectionWidth = pageWidth / 3; // Divide into 3 equal sections

    doc.text("Accountant Signature", sectionWidth * 0.5, signatureY, {
      align: "center",
    });
    doc.text("Authorized Signature", sectionWidth * 1.5, signatureY, {
      align: "center",
    });
    doc.text("Parent Signature", sectionWidth * 2.5, signatureY, {
      align: "center",
    });

    if (save) {
      doc.save(`Fee_Receipt_${data?.receiptNo || "N/A"}.pdf`);
    } else {
      return URL.createObjectURL(doc.output("blob"));
    }
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    onClose(); // Now safely close the original form/modal
  };

  const handleSubmit = async (values) => {
    try {
      const res = await postData(STUDENT_FEE, values);
<<<<<<< Updated upstream
=======
      console.log("[RESPONSE]:", res.data.data);

>>>>>>> Stashed changes
      handleApiResponse(res.data.message, "success");
      await fetchData();

      const formattedFees = res.data.data.fees.map((feeItem) => {
        const matchingFee = allFees.find((f) => f._id === feeItem.fee);
        return {
          feeName: matchingFee ? matchingFee.name : "Unknown Fee",
          amount: feeItem.amount,
        };
      });

      const receiptWithTenant = {
        ...res.data.data,
        feesDatas: formattedFees,
        tenant: tenant,
        name: capitalizeWords(
          studentData.student.firstName + " " + studentData.student.lastName
        ),
        academicYear: studentData.academicYear.year,
        admissionNo: studentData.student?.admissionNumber,
        classSection: `${studentData.class.name} / ${studentData.section.section}`,
        fatersName: capitalizeWords(studentData.student.fatherDetails.name),
        mothersName: capitalizeWords(studentData.student.motherDetails.name),
        pendingAmount: getTotalAmount(values, "pendingAmount"),
      };

      setReceiptData(receiptWithTenant);
      setIsReceiptOpen(true);
      // onClose();
    } catch (error) {
      handleApiResponse(error);
    }
  };

  useEffect(() => {
<<<<<<< Updated upstream
=======
    console.log("Student data for downloading:", studentData);
    console.log("Fees data for downloding:", feesData);

>>>>>>> Stashed changes
    if (selectedData) {
      const classId = selectedData?.academic.class._id;
      getFeesData(classId);
    }
  }, [selectedData]);

  const checkDisabled = (values) => {
    return (
      allFees.filter(
        (fee) => !values.fees.some((selectedFee) => selectedFee._id === fee._id)
      ).length === 0
    );
  };

  const getTotalAmount = (values, key) => {
    return values.fees.reduce((total, fee) => total + fee[key] * 1, 0);
  };

  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors }) => (
          <Form>
            <div className="py-4 text-sm/6">
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
                        Discount
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      <a href="#" className="group inline-flex">
                        After Discount Fee
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
                        <tr key={fee._id}>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            {capitalizeWords(fee.feeName)}
                          </td>

                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            {fee.isAdded ? (
                              <CustomSelect
                                name={`fees.${index}.duration`} // Dynamically bind the name
                                placeholder="Duration"
                                options={feeduration}
                              />
                            ) : (
                              capitalizeWords(fee.duration)
                            )}
                          </td>

                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            {fee.isAdded ? (
                              <CustomInput
                                name={`fees.${index}.totalAmount`} // Dynamically bind the name
                                placeholder="Fee Amount"
                                onChange={(e) => {
                                  setFieldValue(
                                    `fees.${index}.totalAmount`,
                                    e.target.value
                                  );
                                  setFieldValue(`fees.${index}.discount`, 0);
                                  setFieldValue(
                                    `fees.${index}.paybalAmount`,
                                    e.target.value
                                  );
                                  setFieldValue(
                                    `fees.${index}.pendingAmount`,
                                    e.target.value
                                  );
                                }}
                              />
                            ) : (
                              fee.totalAmount
                            )}
                          </td>

                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            {fee.isAdded ? (
                              <CustomInput
                                name={`fees.${index}.discount`} // Dynamically bind the name
                                placeholder="Discount Amount"
                                onChange={(e) => {
                                  setFieldValue(
                                    `fees.${index}.discount`,
                                    e.target.value
                                  );
                                  setFieldValue(
                                    `fees.${index}.paybalAmount`,
                                    fee.totalAmount - e.target.value
                                  );
                                  setFieldValue(
                                    `fees.${index}.pendingAmount`,
                                    fee.totalAmount - e.target.value
                                  );
                                }}
                              />
                            ) : (
                              fee.discount
                            )}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            {fee.paybalAmount}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            {fee.paidAmount}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            {fee.pendingAmount}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            {fee.status.toLowerCase() === "paid" ? (
                              "-"
                            ) : (
                              <CustomDate
                                name={`fees.${index}.dueDate`}
                                minDate={moment().format("YYYY-MM-DD")}
                              />
                            )}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            {fee.status.toLowerCase() === "paid" ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                {fee.status}
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                                {fee.status}
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            <div className="sm:col-span-1">
                              <CustomInput
                                type="number"
                                name={`fees[${index}].paymentAmount`}
                                disabled={fee.status.toLowerCase() === "paid"}
                                className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                              />
                            </div>
                          </td>
                          {fee.isAdded && (
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              <button
                                onClick={() =>
                                  handleRemove(
                                    fee._id,
                                    values.fees,
                                    setFieldValue
                                  )
                                }
                              >
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
                    <td
                      className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                      colSpan={8}
                    >
                      <button
                        type="button"
                        className="inline-flex items-center  px-3 py-2 text-sm font-semibold text-purple-500  "
                        onClick={() => setShowDropdown(!showDropdown)}
                        disabled={checkDisabled(values)}
                      >
                        <PlusIcon
                          aria-hidden="true"
                          className="-ml-0.5 size-5"
                        />
                        Add New
                      </button>

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
                                onClick={() =>
                                  handleAddFee(fee, values.fees, setFieldValue)
                                }
                              >
                                {fee.name}
                              </li>
                            ))}
                        </ul>
                      )}
                    </td>
                    <td>
                      {errors.fees && typeof errors.fees === "string" && (
                        <div className="text-red-500">{errors.fees}</div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                      colSpan={5}
                    ></td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-right">
                      Total Pending:
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-left">
                      ₹ {getTotalAmount(values, "pendingAmount")}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-right">
                      Total Paid:
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-left">
                      ₹ {getTotalAmount(values, "paymentAmount")}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className=" pb-4 mb-4 mt-4">
                <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                  Transaction Details
                </h2>

                <div className=" grid grid-cols-4 gap-x-4 gap-y-4">
                  <div className="sm:col-span-1">
                    <CustomDate
                      name="transactionDate"
                      label="Paid Date"
                      required={true}
                      maxDate={moment().format("YYYY-MM-DD")}
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <CustomSelect
                      label="Payment Mode"
                      name="paymentMode"
                      options={payments}
                      required
                    />
                  </div>

                  {values.paymentMode !== "cash" && (
                    <>
                      <div className="sm:col-span-1">
                        <CustomSelect
                          label="School Credit Bank"
                          name="bank"
                          options={banks}
                          required
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <CustomInput
                          label="Transaction ID"
                          placeholder="Enter Transaction ID"
                          name="transactionId"
                          required
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-x-4 gap-y-4">
                <div className="sm:col-span-1">
                  <CustomFileUploader
                    label="Upload Transaction Proof"
                    name="transactionProof"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                  />
                </div>
              </div>
            </div>
            <div className="flex shrink-0 px-4 py-4 bg-gray-100 w-full justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <Transition show={isReceiptOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsReceiptOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />

          <div className="fixed inset-0 overflow-hidden flex items-center justify-center">
            <div className="w-screen h-screen flex flex-col bg-white shadow-xl">
              {/* Header */}
              <div className="flex justify-between items-center bg-purple-900 p-4 text-white">
                <h3 className="text-lg font-semibold">Fee Receipt Preview</h3>
                <button
                  onClick={handleCloseReceipt}
                  className="text-white text-xl"
                >
                  ✖
                </button>
              </div>

              {/* PDF Preview */}
              <div className="flex-1 overflow-auto">
                {receiptData && (
                  <iframe
                    src={generateReceiptPDF(receiptData, "./schoolLogo.jpg")}
                    className="w-full h-full"
                  ></iframe>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-between p-4 bg-gray-100">
                <button
                  onClick={() =>
                    generateReceiptPDF(
                      receiptData,
                      "./schoolLogo.jpg",
                      "portrait",
                      true
                    )
                  }
                  className="px-4 py-2 bg-purple-600 text-white rounded-md"
                >
                  Download PDF
                </button>
                <button
                  onClick={handleCloseReceipt}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
<<<<<<< Updated upstream
          <div className="flex shrink-0 px-4 py-4 bg-gray-100 w-full justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>

<Transition show={isReceiptOpen} as={Fragment}>
<Dialog as="div" className="relative z-50" onClose={handleCloseReceipt}>
  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />

  <div className="fixed inset-0 overflow-hidden flex items-center justify-center">
    <div className="w-screen h-screen flex flex-col bg-white shadow-xl">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-purple-900 p-4 text-white">
        <h3 className="text-lg font-semibold">Fee Receipt Preview</h3>
        <button onClick={handleCloseReceipt} className="text-white text-xl">
          ✖
        </button>
      </div>

      {/* PDF Preview */}
      <div className="flex-1 overflow-auto">
        {receiptData && (
          <iframe src={generateReceiptPDF(receiptData, "./schoolLogo.jpg")} className="w-full h-full"></iframe>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between p-4 bg-gray-100">
        <button onClick={() => generateReceiptPDF(receiptData, "./schoolLogo.jpg","portrait", true)} className="px-4 py-2 bg-purple-600 text-white rounded-md">
          Download PDF
        </button>
        <button onClick={handleCloseReceipt} className="px-4 py-2 bg-gray-400 text-white rounded-md">
          Close
        </button>
      </div>

    </div>
  </div>
</Dialog>
</Transition>
</>

=======
        </Dialog>
      </Transition>
    </>
>>>>>>> Stashed changes
  );
}

export default FinancCollectFeesDetails;
