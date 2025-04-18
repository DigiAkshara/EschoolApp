import { DialogPanel, DialogTitle } from "@headlessui/react";
import { Dialog, Transition } from "@headlessui/react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  DocumentArrowDownIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import moment from "moment";
import React, { useEffect, useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { getData } from "../../../app/api";
import { ACADEMICS } from "../../../app/url";
import { handleApiResponse } from "../../../commonComponent/CommonFunctions";

function ExamDetailsPage({ onClose }) {
  const [students, setStudents] = useState([]);
  const selectedExam = useSelector((state) => state.exams.selectedExam);
  const subjects = useSelector((state) => state.academics.subjects);
  const classId = selectedExam?.classObject._id;
  const sectionId = selectedExam?.sectionObject._id;
  const { branchData } = useSelector((state) => state.appConfig);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);

  useEffect(() => {
    getStudent();
  }, []);
  const getStudent = async () => {
    try {
      const response = await getData(
        ACADEMICS + "/" + classId + "/" + sectionId
      );
      const studentsData = response.data.data.map((item) => ({
        _id: item.student._id,
        pic: item.student.profilePic?.Location || "",
        name: `${item.student.firstName} ${item.student.lastName}`,
        admissionNo: item.student.admissionNumber,
        DOB: moment(item.student.DOB).format("DD-MM-YYYY"),
        mothersName: item.student.motherDetails.name || " ",
        className: item.class?.name || "N/A",
      }));
      setStudents(studentsData);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.value === subjectId);
    return subject ? capitalizeWords(subject.label) : "Unknown Subject";
  };

  // Helper function to capitalize words
  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const generatePDFPreview = async () => {
    const doc = new jsPDF("p", "mm", "a4"); // Initialize a single PDF document
    const pdfPromises = students.map(async (student, index) => {
      const container = document.createElement("div");
      container.style.width = "800px";
      container.style.position = "absolute"; // Keep it offscreen
      container.style.left = "-9999px"; // Prevent flickering
      container.style.top = "-9999px"; // Keep it out of view
      //container.style.visibility = "hidden"; // Hide it from the user
      container.innerHTML = `
      <div style="padding: 30px; font-family: Arial, sans-serif;">
         <!-- Header Section -->
        <div style="display: flex; justify-content: center; align-items: center; ">
          <!-- School Emblem Div (left side) -->
          <div style="flex: 0 0 auto; text-align: center; position: absolute; left: 30px; width: 120px; height: 120px;">
    <img src="${branchData?.logo?.Location || '/schoolLogo.jpg'}"  alt="School Emblem" 
         style="width: 100%; height: 100%; object-fit: contain; max-width: 110px; max-height: 110px;">
</div>

          <!-- School Information Div (centered) -->
          <div style="text-align: center;  padding-bottom: 20px; width: 100%; max-width: 600px;">
            <h1 style="text-align: center; margin: 0; font-weight: bold; font-size: 20px; color: rgb(116, 38, 199);">${branchData?.label?.toUpperCase()}</h1>
            <p style="margin: 0; font-weight: bold; font-size: 13px; color: rgb(116, 38, 199);">Ph: ${branchData?.mobileNumber || "NILL"
        }  | Email: ${branchData?.email || "NILL"}</p>
            <p style="margin: 0; font-weight: bold;font-size: 13px; color: rgb(116, 38, 199); ">Address: ${branchData?.address?.area
        }, ${branchData?.address?.city}, ${branchData?.address?.state}, ${branchData?.address?.pincode
        }</p>
          </div>
        </div>
        <div style="border-bottom: 1px solid black; width: 100%; margin-top: 10px;"></div>
        <div>
        <h2 style="text-align: center;font-weight: bold;  ">Hall Ticket</h2>
        </div>

        <div style="display: flex; margin-top: 10px;">
          <!-- Left Section (Student details) -->
          <div style="flex: 1; padding-right: 10px;">
            <p><strong>Name of Student:</strong> ${student.name || ""}</p>
            <p><strong>Admission No:</strong> ${student.admissionNo || ""}</p>
            <p><strong>Class:</strong> ${student.className || ""}</p>
            <p><strong>Section:</strong> ${selectedExam?.sectionName || ""}</p>
          </div>

          <!-- Right Section (5 details) -->
          <div style="flex: 1; padding-left: 10px;">
            <p><strong>Roll No:</strong> ${student.rollNumber || ""}</p>
            <p><strong>Date Of birth :</strong> ${student.DOB || ""}</p>
            <p><strong>Mother’s Name:</strong> ${student.motherName || ""}</p>
           
          </div>

          <!-- Image Section (Student photo) -->
           <div style="flex: 1; text-align: center;  display: flex; justify-content: center; align-items: center; ">

<img src="${student.pic || "/default-profile.png"}"  alt="School Emblem" 
         style="width: 100%; height: 100%; object-fit: contain; max-width: 110px; max-height: 110px;">
</div>
        </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; font-family: Arial, sans-serif; color: #333;">
          <thead>
            <tr style="background:rgb(206, 175, 240); color: black; text-align: center; font-weight: bold;">
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Si.No</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Subjects</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Exam Date</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Exam Time</th>
            </tr>
          </thead>
          <tbody>
              ${selectedExam?.timeTable
          .map(
            (exam, index) => `
                <tr>
                <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${index + 1
              }</td>
                  <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${getSubjectName(
                exam.subject
              )}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${exam.examDate
              }</td>
                  <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${exam.startTime
              } - ${exam.endTime}</td>
                 
                </tr>
              `
          )
          .join("")}
            </tbody>
        </table>
        
     
        <div style="margin-top: 20px;">
          <p style="color: rgb(116, 38, 199);"><strong>Signature of Principal / COE</strong></p>
          <p style="color: rgb(116, 38, 199);"><strong>Date:</strong> __________</p>
        </div>

        <div style="margin-top: 20px;">
          <h4>Important Instructions:</h4>
          <ul>
            <li>Students will not be allowed to appear in exams without this Hall Ticket.</li>
            <li>Students must report 15 minutes before the scheduled time.</li>
            <li>Do not write anything on this Hall Ticket.</li>
            <li>Electronic gadgets, notes, and books are not allowed inside the exam hall.</li>
          </ul>
        </div>
      </div>
    `;

      document.body.appendChild(container);

      // Convert HTML to image using html2canvas
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });

      const imgData = canvas.toDataURL("image/png");

      // Calculate PDF dimensions based on canvas size
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image to PDF
      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Cleanup DOM after rendering
      // document.body.removeChild(container);

      // Add a page for the next student's hall ticket (except for the last student)
      if (index < students.length - 1) {
        doc.addPage();
      }
    });

    // Wait for all student PDFs to be added to the document
    await Promise.all(pdfPromises);

    const pdfBlob = doc.output("blob");
    const pdfPreviewUrl = URL.createObjectURL(pdfBlob);

    setPdfBlob(pdfBlob);
    setPdfUrl(pdfPreviewUrl);
    setIsPreviewOpen(true);

    // Save the final PDF as a single file
    // doc.save("Hall_Tickets.pdf");
  };

  const handleDownload = () => {
    if (pdfBlob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = "Hall_Tickets.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-6xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="bg-purple-900 px-3 py-3 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className=" text-base font-semibold text-white">
                        View Exams Info
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={onClose}
                          className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 px-6 py-6 sm:px-6 overflow-y-auto">
                    <div className="form-content">
                      <ul
                        role="list"
                        className="grid grid-cols-1 gap-x-4 gap-y-4"
                      >
                        <li
                          key="12"
                          className="overflow-hidden rounded-xl border border-gray-300"
                        >
                          <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                            <div className="flex items-center item-title-blk">
                              <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
                                <UserCircleIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </div>
                              <div className="text-lg pl-4 font-medium text-gray-900">
                                Class Details
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-4 text-sm/6">
                            <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Board
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExam?.boardName}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Class
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExam?.className}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Section
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExam?.sectionName}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Exam Name{" "}
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExam?.examName}
                                </dd>
                              </div>

                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Exam Dates
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExam?.examDates}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </li>

                        <li
                          key="12"
                          className="overflow-hidden rounded-xl border border-gray-300"
                        >
                          <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                            <div className="flex items-center item-title-blk">
                              <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
                                <UserCircleIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </div>
                              <div className="text-lg pl-4 font-medium text-gray-900">
                                {" "}
                                Exam Time Table
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-4 text-sm/6">
                            <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                              <thead className="bg-purple-100">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Subject Name
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Exam Date
                                    </a>
                                  </th>

                                  <th
                                    scope="col"
                                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Exam Start and End Time
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Pass Marks
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Total Marks
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Syllabus
                                    </a>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {selectedExam?.timeTable.map((exam, index) => (
                                  <tr Key={index}>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">
                                      {subjects.map((subject) => {
                                        if (subject.value === exam.subject) {
                                          return (
                                            <span>
                                              {capitalizeWords(subject.label)}
                                            </span>
                                          );
                                        }
                                      })}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {exam.examDate}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {exam.startTime} - {exam.endTime}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">
                                      {exam.passMark}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {exam.totalMark}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {exam.syllabus}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </li>

                        <li
                          key="12"
                          className="overflow-hidden rounded-xl border border-gray-300"
                        >
                          <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                            <div className="flex items-center item-title-blk">
                              <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
                                <UserCircleIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </div>
                              <div className="text-lg pl-4 font-medium text-gray-900">
                                Hall Tickets
                              </div>
                            </div>
                          </div>

                          <div
                            className="px-4 py-4 text-sm/6"
                            // onClick={generatePDFs}
                            onClick={generatePDFPreview}
                            role="button"
                            tabIndex={0}
                          >
                            <ul
                              role="list"
                              className="grid grid-cols-4 gap-x-6 gap-y-8"
                            >
                              <li
                                key="12"
                                className="overflow-hidden rounded-xl border border-gray-300"
                              >
                                <div className="flex items-center justify-between gap-x-4 px-4 py-4">
                                  <div className="flex items-center item-title-blk">
                                    <div className="inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white">
                                      <DocumentArrowDownIcon
                                        aria-hidden="true"
                                        className="size-5"
                                      />
                                    </div>
                                    <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                                      <span>
                                        {selectedExam?.examName} -{" "}
                                        {selectedExam?.className}-
                                        {selectedExam?.sectionName}
                                      </span>
                                    </div>
                                  </div>
                                  <a href="#" className="text-gray-400">
                                    <EyeIcon
                                      aria-hidden="true"
                                      className="size-5"
                                    />
                                  </a>
                                </div>
                              </li>
                            </ul>
                          </div>
                          {/* Modal for PDF Preview */}
                          <Transition show={isPreviewOpen} as={Fragment}>
                            <Dialog
                              as="div"
                              className="relative z-50"
                              onClose={() => setIsPreviewOpen(false)}
                            >
                              <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />

                              <div className="fixed inset-0 overflow-hidden flex items-center justify-center">
                                <div className="w-screen h-screen flex flex-col bg-white shadow-xl">
                                  {/* Header with Close Button */}
                                  <div className="flex justify-between items-center bg-purple-900 p-4 text-white">
                                    <h3 className="text-lg font-semibold">
                                      Hall Ticket Preview
                                    </h3>
                                    <button
                                      onClick={() => setIsPreviewOpen(false)}
                                      className="text-white text-xl"
                                    >
                                      ✖
                                    </button>
                                  </div>

                                  {/* PDF Preview */}
                                  <div className="flex-1 overflow-auto">
                                    {pdfUrl && (
                                      <iframe
                                        src={pdfUrl}
                                        className="w-full h-full"
                                      ></iframe>
                                    )}
                                  </div>

                                  {/* Footer Buttons */}
                                  <div className="flex justify-between p-4 bg-gray-100">
                                    <button
                                      onClick={handleDownload}
                                      className="px-4 py-2 bg-purple-600 text-white rounded-md"
                                    >
                                      Download PDF
                                    </button>
                                    <button
                                      onClick={() => setIsPreviewOpen(false)}
                                      className="px-4 py-2 bg-gray-400 text-white rounded-md"
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </Dialog>
                          </Transition>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExamDetailsPage;
