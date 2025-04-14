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
    };
    generateReceiptPDF(receiptData, "./schoolLogo.jpg")
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
    doc.text((data.receiptLabel || "School Name").toUpperCase(), centerX, 15, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.text(
      `Phone: ${data.branch?.phoneNumber || "N/A"} | Email: ${
        data.branch?.email || "N/A"
      }`,
      centerX,
      21,
      { align: "center" }
    );
    doc.text(
      `Address: ${data.branch?.address?.area || "N/A"}, ${
        data.branch?.address?.city || "N/A"
      }, ${data.branch?.address?.state || "N/A"}, ${
        data.branch?.address?.pincode || "N/A"
      }`,
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
    doc.text(`Roll No: ${data?.rollNumber || "N/A"}`, 140, detailsStartY + 20);

    doc.text(
      `Academic Year: ${data?.academicYear || "N/A"}`,
      20,
      detailsStartY + 30
    );
    doc.text(`Branch: ${data?.branch.label || "N/A"}`, 140, detailsStartY + 30);

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
    const tableData = (data?.fees || []).map((fee, index) => [
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

    // Function to convert amount to words (basic implementation)
    const numberToWords = (num) => {
      const words = require("number-to-words");
      return words.toWords(num).toUpperCase();
    };

    const paidAmount = data?.paidAmount || 0; // Ensure a default value of 0
    const pending = data?.pendingAmount || 0; // Ensure a default value of 0

    // Convert amount to words safely
    const totalPaidAmountInWords = numberToWords(paidAmount) + " ONLY";

    // Calculate pending amount safely
    const pendingAmount = pending - paidAmount;

    // Get the final Y position after the table
    const finalY = doc.lastAutoTable.finalY + 10; // Adding some spacing below table

    // Add Total Paid Amount, Amount in Words, and Pending Balance below the table
    if (paidAmount > 0) {
      doc.text(`Total Paid Amount: ${paidAmount || "N/A"}`, 20, finalY);
      doc.text(
        `Total Paid Amount In Words: ${totalPaidAmountInWords || "N/A"}`,
        20,
        finalY + 10
      );
      // doc.text(`Pending Amount: ${pendingAmount || "N/A"}`, 20, finalY + 20);
    }
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
      window.open(URL.createObjectURL(doc.output("blob")), "_blank");
      // return URL.createObjectURL(doc.output("blob"));
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
