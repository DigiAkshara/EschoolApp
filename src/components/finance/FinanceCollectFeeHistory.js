import moment from "moment";
import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react"; // For modal transitions
import { useSelector } from "react-redux";
import { getData } from "../../app/api";
import { TRANSACTIONS } from "../../app/url";
import { jsPDF } from "jspdf"; // For PDF generation
import {
  capitalizeWords,
  handleApiResponse,
} from "../../commonComponent/CommonFunctions";
import TableComponent from "../../commonComponent/TableComponent";
import { Fragment } from "react"; // Required for <Fragment>
import autoTable from "jspdf-autotable";


function FinanceCollectFeeHistory() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const rowsPerPage = 10;
  const selectedData = useSelector((state) => state.fees.selectedFee);
  const studentData = selectedData?.academic;
  const tenant = useSelector((state) => state.tenantData);

  const columns = [
    { title: "Transaction Id", key: "transactionId" },
    { title: "Paid Date", key: "paidDate" },
    { title: "Paid Mode", key: "paidMode" },
    { title: "Fee Types & Paid Amount", key: "feeAmounts" },
    { title: "Total Paid", key: "totalPaid" },
    { title: "Invoice", key: "invoice" },
  ];
  const getHistoryData = async (Id) => {
    try {
      let res = await getData(TRANSACTIONS + "/" + Id);
      console.log("History Res::", res.data);

      let list = res.data.map((trans) => ({
        transactionId: trans.transactionId || "N/A",
        paidDate: moment(trans.date).format("DD-MM-YYYY"),
        paidMode: trans.transactionType.toUpperCase(),
        feeAmounts: trans.fees.map((fee, index) => (
          <span>
            {capitalizeWords(fee.fee.name)} : {fee.amount}
            {index + 1 === trans.fees.length ? "." : ", "}
          </span>
        )),
        totalPaid: trans.amount,
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
    }
  };


  const showInvoice = (feeData) => {
  
    const formattedFees = feeData.fees?.map((feeItem) => ({
      feeName: capitalizeWords(feeItem.fee.name),
      amount: feeItem.amount,
    })) || [];
  
    const receiptData = {
      ...feeData,
      name: capitalizeWords(
        studentData.student.firstName + " " + studentData.student.lastName
      ),
      academicYear: studentData.academicYear.year,
      admissionNo: studentData.student?.admissionNumber || "N/A",
      classSection: `${studentData.class?.name || "N/A"} / ${
        studentData.section?.section || "N/A"
      }`,
      fatersName: capitalizeWords(studentData.student.fatherDetails?.name || "N/A"),
      mothersName: capitalizeWords(studentData.student.motherDetails?.name || "N/A"),
      tenant: tenant,
      fees: formattedFees, // Store fees separately
    };
  
    console.log("RECEIPT Data::", receiptData);
    setReceiptData(receiptData);
    setIsReceiptOpen(true);
  };
  
  
  

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
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
    console.log("DATA FOR Download::::",data);
    
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

  useEffect(() => {
    if (selectedData) {
      getHistoryData(selectedData.fees.student);
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
          showModal={showInvoice}
          modalColumn={["invoice"]}
          checkColumn={false}
        />
      </div>

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
              </Dialog>
            </Transition>
    </>
  );
}

export default FinanceCollectFeeHistory;
