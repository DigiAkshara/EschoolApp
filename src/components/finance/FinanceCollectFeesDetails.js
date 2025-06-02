import { FieldArray, Form, Formik } from "formik";
import { jsPDF } from "jspdf"; // For PDF generation
import autoTable from "jspdf-autotable";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { getData, postData } from "../../app/api";
import { FEES, STUDENT_FEE } from "../../app/url";
import {
  capitalizeWords,
  handleApiResponse,
  paymentType,
  uploadFile
} from "../../commonComponent/CommonFunctions";
import CustomDate from "../../commonComponent/CustomDate";
import CustomFileUploader from "../../commonComponent/CustomFileUploader";
import CustomInput from "../../commonComponent/CustomInput";
import CustomSelect from "../../commonComponent/CustomSelect";

function FinancCollectFeesDetails({ onClose, fetchData }) {
  const { branchData } = useSelector((state) => state.appConfig)
  const { selectedFee: selectedData, bankAccounts, receiptNames } = useSelector((state) => state.fees);
  const [allFees, setAllFees] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [receiptOptions, setReceiptOptions] = useState([]);
  const classId = selectedData?.academic.class._id;
  const selectedFee = selectedData?.fees;
  const studentData = selectedData?.academic;
  const getInitialValues = () => {
    return {
      studentId: selectedData?.fees?.student,
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
      }) || [],
      transactionDate: moment().format("YYYY-MM-DD"),
      paymentMode: "",
      bank: "",
      transactionId: "",
      transactionProof: "",
      totalPaymentAmount: "",
      receiptLabel: "",
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
          if (paymentMode === "online" && !value) {
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
          if (paymentMode === "online" && !value) {
            return false; // Fail validation if paymentMode is not 'cash' but value is invalid
          }
          return true; // Pass validation otherwise
        }
      ),
      transactionProof: Yup.object().nullable(),
      receiptLabel: Yup.string(),
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

  const numberToWords = (num) => {
    const words = require("number-to-words");
    return words.toWords(num).toUpperCase();
  };
  const generateReceiptPDF = (data, logoUrl, orientation = "portrait", save = false) => {
    const doc = new jsPDF(orientation, "mm", "a4");
    const defaultLogo = "./schoolLogo.jpg";
    const centerX = doc.internal.pageSize.getWidth() / 2;
    const format = (logoUrl || defaultLogo).toLowerCase().endsWith(".jpg") ? "JPEG" : "PNG";

    const renderHeader = (y, copyLabel) => {
      doc.setFontSize(6);
      doc.text(copyLabel, 180, y, { align: "right" });
      doc.addImage(logoUrl || defaultLogo, format, 10, y, 28, 28);
      doc.setFont("times", "normal");
      doc.setFontSize(12);
      doc.text((data.receiptLabel || "School Name").toUpperCase(), centerX, y + 10, { align: "center" });
      doc.setFontSize(10);
      doc.text(
        `Address: ${data.branch?.address?.area || "N/A"}, ${data.branch?.address?.city || "N/A"}, ${data.branch?.address?.state || "N/A"}, ${data.branch?.address?.pincode || "N/A"}`,
        centerX,
        y + 22,
        { align: "center" }
      );
      doc.line(10, y + 30, 200, y + 30);
      doc.setFontSize(12);
      doc.text("FEE RECEIPT", centerX, y + 40, { align: "center" });
      return y + 50;
    };

    const renderStudentDetails = (startY) => {
      doc.setFontSize(10);
      doc.text(`Admission No: ${data?.admissionNo || "N/A"}`, 15, startY);
      doc.text(`Student Name: ${data?.name || "N/A"}`, 15, startY + 5);
      doc.text(`Father's Name: ${data?.fatersName || "N/A"}`, 15, startY + 10);
      doc.text(`Class & Section: ${data?.classSection || "N/A"}`, 15, startY + 15);

      doc.text(`Date: ${data?.createdDate || "N/A"}`, 120, startY);
      doc.text(`Receipt No: ${data?.receiptNumber || "N/A"}`, 120, startY + 5);
      doc.text(`Branch: ${data?.branch?.label || "N/A"}`, 120, startY + 10);
      doc.text(`Mode of Payment: ${data?.transactionMode === "online" ? "Online" : "Cash"}`, 120, startY + 15);

      return startY + 20;
    };

    const renderFeeTable = (startY) => {
      const columns = ["Si.No", "Fee Type", "Amount"];
      const rows = (data?.feesDatas || []).map((fee, index) => [index + 1, fee?.feeName || "N/A", `${fee?.amount || "0"}`]);

      autoTable(doc, {
        startY,
        head: [columns],
        body: rows.length ? rows : [[1, "No fee details available", "₹0"]],
        theme: "grid",
        headStyles: { fillColor: [206, 175, 240] },
        styles: { fontSize: 10 },
      });

      return doc.lastAutoTable.finalY + 5;
    };

    const renderAmountSection = (startY, amount, pending) => {
      const amountInWords = `${numberToWords(amount || 0)} ONLY`;
      doc.setFontSize(10);
      doc.text(`Total Paid Amount: ${amount || "N/A"}`, 15, startY);
      doc.text(`Total Paid Amount In Words: ${amountInWords}`, 15, startY + 5);
      return startY + 10;
    };

    const renderFooter = (startY) => {
      const sectionWidth = doc.internal.pageSize.getWidth() / 3;
      doc.text("Accountant Signature", sectionWidth * 0.5, startY, { align: "center" });
      doc.text("Authorized Signature", sectionWidth * 2.5, startY, { align: "center" });
      doc.line(10, startY + 5, 200, startY + 5);
      doc.text("Thank you for your payment!", centerX, startY + 10, { align: "center" });
    };

    // Render Admin Copy
    let y = renderHeader(5, "Admin Copy");
    y = renderStudentDetails(y);
    y = renderFeeTable(y);
    y = renderAmountSection(y, data?.paidAmount, data?.pendingAmount);
    renderFooter(y + 10);

    // Render Student Copy
    y = renderHeader(150, "Student Copy");
    y = renderStudentDetails(y);
    y = renderFeeTable(y);
    y = renderAmountSection(y, data?.paidAmount, data?.pendingAmount);
    renderFooter(y + 10);

    // Save or display
    if (save) {
      doc.save(`Fee_Receipt_${data?.receiptNumber || "N/A"}.pdf`);
    } else {
      window.open(URL.createObjectURL(doc.output("blob")), "_blank");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const res = await postData(STUDENT_FEE, values);
      handleApiResponse(res.data.message, "success");
      await fetchData();
      let paidAmount = 0
      const formattedFees = res.data.data.fees.map((feeItem) => {
        const matchingFee = allFees.find((f) => f._id === feeItem.fee);
        if (matchingFee?.feeGroup.name.toLowerCase() !== 'miscellaneous fees') paidAmount += feeItem.amount
        return {
          feeName: matchingFee ? matchingFee.name : "Unknown Fee",
          amount: matchingFee?.feeGroup.name.toLowerCase() === 'miscellaneous fees' ? 'Paid' : feeItem.amount,
          type: matchingFee?.feeGroup.name
        };
      });
      let receiptLabel = branchData.label
      if (values.receiptLabel) {
        const obj = receiptOptions.find((option) => option.value === res.data.data.receiptLabel);
        if (obj) receiptLabel = obj.label
      }
      const receiptWithTenant = {
        ...res.data.data,
        feesDatas: formattedFees,
        branch: branchData,
        name: capitalizeWords(
          studentData.student.firstName + " " + studentData.student.lastName
        ),
        academicYear: studentData.academicYear.year,
        admissionNo: studentData.student?.admissionNumber,
        classSection: `${studentData.class.name} / ${studentData.section.section}`,
        fatersName: capitalizeWords(studentData.student.fatherDetails.name),
        mothersName: capitalizeWords(studentData.student.motherDetails.name),
        rollNumber: studentData?.student?.rollNumber,

        pendingAmount: getTotalAmount(values, "pendingAmount", true),
        paidAmount: paidAmount,
        receiptLabel,
        createdDate: moment(res.data.data.createdAt).format("DD-MM-YYYY hh:mm A"),
        transactionMode: res.data.data.transactionMode
      };
      generateReceiptPDF(receiptWithTenant, branchData?.logo?.Location)
      onClose();
    } catch (error) {
      handleApiResponse(error);
    }
  };


  useEffect(() => {
    if (selectedData) {
      const classId = selectedData?.academic.class._id;
      getFeesData(classId);
    }
  }, [selectedData]);

  useEffect(() => {
    let accountOptions = bankAccounts.map((account) => {
      return ({
        value: account._id,
        label: `${account.name} - ${account.accountNumber}`
      })
    })
    setAccountOptions(accountOptions)
  }, [bankAccounts])


  useEffect(() => {
    let receiptOptions = receiptNames.map((item) => {
      return ({
        value: item._id,
        label: item.name
      })
    })
    setReceiptOptions(receiptOptions)
  }, [receiptNames])


  const getTotalAmount = (values, key, miscellaneous = false) => {
    let dummyList = [];
    if (miscellaneous) {
      values.fees.forEach((fee) => {
        let feeObj = allFees.find((f) => f._id === fee._id);
        if (feeObj?.feeGroup.name.toLowerCase() !== 'miscellaneous fees') dummyList.push(fee)
      })
    } else {
      dummyList = [...values.fees];
    }
    return dummyList.reduce((total, fee) => total + fee[key] * 1, 0);
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
                            {capitalizeWords(fee.duration)}
                          </td>

                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            {<>
                              {fee.feeName === 'Bus Fee' ? fee.paybalAmount * 1 + fee.discount * 1 :
                                fee.totalAmount}
                            </>}
                          </td>

                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            {fee.discount}
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
                                disabled={selectedData?.academic?.status !== 'active'}
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
                                disabled={fee.status.toLowerCase() === "paid" || selectedData?.academic?.status !== "active"}
                                className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </FieldArray>

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
              {selectedData?.academic?.status === "active" && (<>
                <div className=" pb-4 mb-4 mt-4">
                  <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                    Transaction Details
                  </h2>

                  <div className=" grid grid-cols-4 gap-x-4 gap-y-4">


                    <div className="sm:col-span-1">
                      <CustomSelect
                        label="Payment Mode"
                        name="paymentMode"
                        options={paymentType}
                        required
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <CustomDate
                        name="transactionDate"
                        label="Paid Date"
                        required={true}
                        disabled={true}
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <CustomSelect
                        label="Receipt Label"
                        name="receiptLabel"
                        options={receiptOptions}
                      />
                    </div>


                    {values.paymentMode === "online" && (
                      <>
                        <div className="sm:col-span-1">
                          <CustomSelect
                            label="School Credit Bank"
                            name="bank"
                            options={accountOptions}
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
              </>)}
            </div>
            <div className="flex shrink-0 px-4 py-4 bg-gray-100 w-full justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
              >
                Cancel
              </button>
              {selectedData?.academic?.status === "active" &&
                <button
                  type="submit"
                  className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                >
                  Submit
                </button>}
            </div>
          </Form>
        )}
      </Formik>

    </>
  );
}

export default FinancCollectFeesDetails;
