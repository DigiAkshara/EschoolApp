import { Dialog, Transition } from "@headlessui/react"; // For modal transitions
import { jsPDF } from "jspdf"; // For PDF generation
import autoTable from "jspdf-autotable";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../app/api";
import { TRANSACTIONS } from "../../app/url";
import {
  capitalizeWords,
  handleApiResponse,
} from "../../commonComponent/CommonFunctions";
import TableComponent from "../../commonComponent/TableComponent";
import { setIsLoader } from "../../app/reducers/appConfigSlice";

function FinanceCollectFeeHistory() {
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const selectedData = useSelector((state) => state.fees.selectedFee);
  const { branchData } = useSelector((state) => state.appConfig);

  const columns = [
    { title: "Transaction Id", key: "transactionId" },
    { title: "Paid Date", key: "date" },
    { title: "Paid Mode", key: "paidMode" },
    { title: "Fee Types & Paid Amount", key: "feeAmounts" },
    { title: "Total Paid", key: "totalPaid" },
    { title: "Invoice", key: "invoice" },
  ];
  const getHistoryData = async (Id) => {
    try {
      dispatch(setIsLoader(true));
      let res = await getData(TRANSACTIONS + "/" + Id);
      let list = res.data.data.map((trans) => ({
        transactionId: trans.transaction.transactionNo || "N/A",
        date: trans.transaction.date,
        paidMode: capitalizeWords(trans.transaction.transactionMode),
        feeAmounts: trans.transaction.fees.map((fee, index) => (
          <span key={index}>
            {capitalizeWords(fee.fee.name)} : {fee.amount}
            {index + 1 === trans.transaction.fees.length ? "." : ", "}
          </span>
        )),
        totalPaid: trans.transaction.amount,
        invoice: (
          <button
            onClick={() => showInvoice(trans)}
            className="text-blue-600 hover:underline"
          >
            View
          </button>
        ),
      }));
      setTransactions(list);
    } catch (error) {
      handleApiResponse(error);
    } finally {
      dispatch(setIsLoader(false));
    }
  };

  const showInvoice = (feeData) => {
    let paidAmount = 0;
    const formattedFees =
      feeData.transaction.fees?.map((feeItem) => {
        if (feeItem.fee.feeGroup.name.toLowerCase() !== "miscellaneous fees")
          paidAmount += feeItem.amount;
        return {
          feeName: capitalizeWords(feeItem.fee.name),
          amount:
            feeItem.fee.feeGroup.name.toLowerCase() !== "miscellaneous fees"
              ? feeItem.amount
              : "Paid",
        };
      }) || [];
    let receiptLabel = branchData.label;
    if (feeData.transaction.receiptLabel) {
      receiptLabel = feeData.transaction.receiptLabel.name;
    }
    const receiptData = {
      ...feeData.transaction,
      ...feeData.academic,
      name: capitalizeWords(
        feeData.academic?.student?.firstName +
          " " +
          feeData.academic?.student?.lastName
      ),
      academicYear: feeData.academic?.academicYear.year,
      admissionNo: feeData.academic?.student?.admissionNumber || "N/A",
      classSection: `${feeData.academic?.class?.name || "N/A"} / ${
        feeData.academic?.section?.section || "N/A"
      }`,
      fatersName: capitalizeWords(
        feeData.academic?.student?.fatherDetails?.name || "N/A"
      ),
      mothersName: capitalizeWords(
        feeData.academic?.student?.motherDetails?.name || "N/A"
      ),
      rollNumber: feeData.academic?.student?.rollNumber,
      branch: branchData,
      fees: formattedFees, // Store fees separately
      receiptLabel,
      paidAmount,
      createdDate: moment(feeData.transaction.createdAt).format("DD-MM-YYYY hh:mm A"),
      transactionMode: feeData.transaction.transactionMode
    };
    generateReceiptPDF(receiptData, branchData?.logo?.Location)
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
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
      const rows = (data?.fees || []).map((fee, index) => [index + 1, fee?.feeName || "N/A", `${fee?.amount || "0"}`]);
  
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

  useEffect(() => {
    if (selectedData) {
      getHistoryData(selectedData?.fees?.student);
    }
  }, [selectedData]);
  return (
    <>
      <div className="py-4 text-sm/6">
        <TableComponent
          columns={columns}
          data={paginatedData}
          pagination={{
            currentPage,
            totalCount: transactions.length,
            onPageChange: handlePageChange,
          }}
          checkColumn={false}
        />
      </div>

    </>
  );
}

export default FinanceCollectFeeHistory;
