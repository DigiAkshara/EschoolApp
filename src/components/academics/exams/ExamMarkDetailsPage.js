import { DialogPanel, DialogTitle } from '@headlessui/react';
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowsUpDownIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import html2canvas from "html2canvas";
import moment from "moment";
import React, { useEffect, useState , Fragment} from "react";
import { useSelector } from "react-redux";
import { capitalizeWords } from "../../../commonComponent/CommonFunctions";
import jsPDF from 'jspdf';


function ExamMarkDetailsPage({ onClose }) {
  const selectedExamDetails = useSelector((state) => state.exams.selectedExamDetails)
  const subjectOptions = useSelector((state) => state.academics.subjects)
  const [studentMarks, setStudents] = useState([])
  const tenant = useSelector((state) => state.tenantData);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [pdfBlob, setPdfBlob] = useState(null);

  const getSubjectName = (subjectId) => {
    return subjectOptions
      .find((subject) => subject.value === subjectId)
      ?.label.toUpperCase();
  };


  function getGrade(marks) {
    if (marks >= 91) return "A+";
    if (marks >= 81) return "A";
    if (marks >= 71) return "B+";
    if (marks >= 61) return "B";
    if (marks >= 51) return "C+";
    if (marks >= 41) return "C";
    if (marks >= 32) return "D+";
    return "D"; // Below 32 is "D"
  }

  function getTotalMarks(student) {
    return selectedExamDetails.exam.timeTable.reduce(
      (total, subject, i) => total + (student?.marks[i]?.marks || 0),
      0
    );
  }

  function getTotalPercentage(student) {
    const totalMarksObtained = getTotalMarks(student);
    const totalMaxMarks = selectedExamDetails.exam.timeTable.reduce(
      (total, subject) => total + subject.totalMark,
      0
    );
    return ((totalMarksObtained / totalMaxMarks) * 100).toFixed(2);
  }

  function getOverallGrade(student) {
    const percentage = getTotalPercentage(student);
    return getGrade(percentage); // Assuming getGrade() maps percentage to a grade
  }

  const getResult = (marks, timeTable) => {
    let isPassed = true
    marks.forEach((item) => {
      let passMark = timeTable.find(
        (subject) => subject.subject === item.subject
      )?.passMark;
      if (item.marks < passMark * 1) {
        isPassed = false;
      }
    })
    return isPassed ? 'Pass' : 'Fail'
  }

  useEffect(() => {
    if (selectedExamDetails) {
      let dumpList = []
      selectedExamDetails.marksDetails.forEach((item) => {
        dumpList.push({
          ...item.student,
          marks: item.marks.map((item) => ({
            subject: getSubjectName(item.subject),
            marks: item.marks,
          })),
          marksObtained: item.marks.reduce((acc, item) => acc + item.marks, 0),
          maxMarks: selectedExamDetails?.exam.timeTable.reduce(
            (acc, item) => acc + item.totalMark * 1,
            0
          ),
          percentage: Math.round(
            (item.marks.reduce((acc, item) => acc + item.marks, 0) /
              selectedExamDetails?.exam.timeTable.reduce(
                (acc, item) => acc + item.totalMark * 1,
                0
              )) *
            100
          ),
          result: getResult(item.marks, selectedExamDetails?.exam.timeTable),
        })
      })
      setStudents(dumpList)
    }
  }, [selectedExamDetails]);



  const generatePDFPreview = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pdfPromises = studentMarks.map(async (student, index) => {
      const container = document.createElement("div");
      container.style.width = "800px"; // Set a fixed width for consistent rendering

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
    <img src='/schoolLogo.jpg' alt="School Emblem" 
         style="width: 100%; height: 100%; object-fit: contain; max-width: 110px; max-height: 110px;">
</div>

          <!-- School Information Div (centered) -->
          <div style="text-align: center;  padding-bottom: 20px; width: 100%; max-width: 600px;">
            <h1 style="text-align: center; margin: 0; font-weight: bold; font-size: 20px; color: rgb(116, 38, 199);">${tenant?.name?.toUpperCase()}</h1>
            <p style="margin: 0; font-weight: bold; font-size: 13px; color: rgb(116, 38, 199);">Ph: ${tenant?.phoneNumber || ""} | Email: ${tenant?.email}</p>
            <p style="margin: 0; font-weight: bold;font-size: 13px; color: rgb(116, 38, 199); ">Address: ${tenant?.city || ""}, ${tenant?.district || ""}, ${tenant?.state || ""}, ${tenant?.pincode || ""}</p>
          </div>
        </div>
        <div style="border-bottom: 1px solid black; width: 100%; margin-top: 10px;"></div>

        <div>
        <h2 style="text-align: center;font-weight: bold; ">Result Card</h2>
        </div>
        <div style="display: flex; margin-top: 10px;">
          <!-- Left Section (Student details) -->
          <div style="flex: 1; padding-right: 10px;">
            <p><strong>Name of Student:</strong> ${student.firstName || ""} ${student.lastName || ""}</p>
            <p><strong>Mother's Name:</strong> ${student.motherName || ""}</p>
            <p><strong>Father's Name:</strong> ${student.fatherName || ""}</p>
            <p><strong>Address:</strong> ${student.address || ""}</p>
          </div>

          <!-- Right Section (5 details) -->
          <div style="flex: 1; padding-left: 10px;">
            <p><strong>Roll No:</strong> ${student.rollNo || ""}</p>
            <p><strong>Admission Number:</strong> ${student.admissionNumber || ""}</p>
            <p><strong>Date of Birth:</strong> ${student.dob ? new Date(student.dob).toLocaleDateString() : ""}</p>
            <p><strong>Exam:</strong> ${selectedExamDetails.exam.name || ""}</p>
            <p><strong>Academic Year:</strong> ${selectedExamDetails.academicYear.year || ""}</p>
          </div>
          <div style="flex: 1; text-align: center;  display: flex; justify-content: center; align-items: center; ">
<div style="text-align: center; width: 75px; height: 100px; border: 1px solid #ccc;  justify-content: center; align-items: center; ">
  <img src="path_to_student_photo.jpg" alt="Student Photo" style="max-width: 100%; max-height: 100%; object-fit: cover;">
</div>
</div>

        </div>

        <!-- Exam Results Table -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; font-family: Arial, sans-serif; color: #333;">
          <thead>
            <tr style="background:rgb(206, 175, 240); color: black; text-align: center; font-weight: bold;">
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Subject</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Marks Obtained</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Total Marks</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Pass Mark</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Grade</th>
            </tr>
          </thead>
          <tbody>
            ${selectedExamDetails.exam.timeTable
          .map((subject, i) => {
            const marksObtained = student.marks[i]?.marks || 0;
            const grade = getGrade(marksObtained);

            return `
                  <tr style="background: ${i % 2 === 0 ? "#f9f9f9" : "#fff"}; text-align: center; border-bottom: 1px solid #ddd;">
                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${getSubjectName(subject.subject)}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${marksObtained}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${subject.totalMark}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${subject.passMark}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${grade}</td>
                  </tr>
                `;
          })
          .join("")}
            <tr style="background:rgb(232, 215, 250); font-weight: bold; text-align: center;">
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total Marks: ${student.marksObtained} / ${student.maxMarks}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Total Percentage: ${student.percentage}%</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Overall Grade: ${getOverallGrade(student)}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Result: ${student.result}</td>
            </tr>
          </tbody>
        </table>
  
        <div style="margin-top: 40px; text-align: center;">
          <p>Sign of Class Teacher &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; Sign of Principal &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; Sign of Manager</p>
          <hr style="margin-top: 10px; border: 1px solid #ccc; width: 100%;">
        </div>
      </div>`;


      // Append to body (hidden) for rendering
      document.body.appendChild(container);

      // Convert the HTML element to a canvas using html2canvas
      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // Calculate PDF dimensions based on canvas size
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image to PDF
      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Cleanup DOM after rendering
      // document.body.removeChild(container);

      // Add a page for the next student's report
      // doc.addPage();

      if (index < studentMarks.length ) {
        doc.addPage();
      }
    });

    // Wait for all PDFs to be generated (in the same document)
    await Promise.all(pdfPromises);

    const pdfBlob = doc.output("blob");
    const pdfPreviewUrl = URL.createObjectURL(pdfBlob);

    setPdfBlob(pdfBlob); 
    setPdfUrl(pdfPreviewUrl);
    setIsPreviewOpen(true);

    // Save the final PDF
    // doc.save(`PROGRESS_CARD_${selectedExamDetails.exam.name}.pdf`);
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
                        View Exam Results
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
                                Exam Details
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
                                  {selectedExamDetails?.exam.board}</dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Class Category
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExamDetails?.exam.classCategory?.name}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Class
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExamDetails?.exam.class?.name}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Section
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExamDetails?.exam.section?.section}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Subjects Included
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExamDetails?.exam.timeTable.length}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Exam Name{' '}
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExamDetails?.exam.name}
                                </dd>
                              </div>

                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Exam Dates
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {moment(selectedExamDetails?.exam.startDate).format('DD-MM-YYYY')}  - {moment(selectedExamDetails?.exam.endDate).format('DD-MM-YYYY')}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Class Total Pass Percentage
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExamDetails?.passPercentage}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </li>

                        <li
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
                                {' '}
                                Exam Results
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-4 text-sm/6">
                            <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                              <thead className="bg-purple-100">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Roll no
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Student Name
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  {selectedExamDetails?.exam.timeTable.map((subject, index) => (
                                    <th key={index}
                                      scope="col"
                                      className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                    >
                                      <a href="#" className="group inline-flex">
                                        {getSubjectName(subject.subject)} ({subject.totalMark})
                                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                          <ArrowsUpDownIcon
                                            aria-hidden="true"
                                            className="size-4"
                                          />
                                        </span>
                                      </a>
                                    </th>
                                  ))}
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Mark Obt.
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Max Marks
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Per(%)
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Result
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white z-1">
                                {studentMarks.map((student, index) => (
                                  <tr key={index}>
                                    <td className="px-2 py-2 text-sm">
                                      {index + 1}
                                    </td>
                                    <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-0">
                                      <a
                                        href="#"
                                        className="text-purple-600 hover:text-purple-900"
                                      >
                                        <div className="flex items-center">
                                          {student.profilePic ? (
                                            <div className="size-9 shrink-0">
                                              <img
                                                src={student.imageUrl}
                                                alt={student.name}
                                                className="size-9 rounded-full"
                                              />
                                            </div>) :
                                            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                              <span className="font-medium text-gray-600 dark:text-gray-300">{student.firstName.charAt(0)}</span>
                                            </div>}
                                          <div className="ml-4">
                                            <div className="font-medium text-gray-900 text-purple-600">
                                              {capitalizeWords(student.firstName + ' ' + student.lastName)}
                                            </div>
                                            <div className="mt-1 text-gray-500">
                                              {student.admissionNumber}
                                            </div>
                                          </div>
                                        </div>
                                      </a>
                                    </td>
                                    {student.marks.map((subject, index) => (
                                      <td className="px-2 py-2 text-sm" key={index}>
                                        {subject.marks}
                                      </td>
                                    ))}
                                    <td className="px-2 py-2 text-sm">
                                      {student.marksObtained}
                                    </td>
                                    <td className="px-2 py-2 text-sm">
                                      {student.maxMarks}
                                    </td>
                                    <td className="px-2 py-2 text-sm">
                                      {student.percentage}
                                    </td>
                                    <td className="px-2 py-2 text-sm">
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${student.result === 'Pass'
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                          }`}
                                      >
                                        {student.result}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </li>

                        <li
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
                                Progress Cards
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-4 text-sm/6" 
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
                                      <span>{selectedExamDetails?.exam.name} - {selectedExamDetails?.exam.class?.name}-{selectedExamDetails?.exam.section?.section}</span>
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
                            <Dialog as="div" className="relative z-50" onClose={() => setIsPreviewOpen(false)}>
                              <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
                          
                              <div className="fixed inset-0 overflow-hidden flex items-center justify-center">
                                <div className="w-screen h-screen flex flex-col bg-white shadow-xl">
                                  
                                  {/* Header with Close Button */}
                                  <div className="flex justify-between items-center bg-purple-900 p-4 text-white">
                                    <h3 className="text-lg font-semibold">Hall Ticket Preview</h3>
                                    <button onClick={() => setIsPreviewOpen(false)} className="text-white text-xl">
                                      ✖
                                    </button>
                                  </div>
                          
                                  {/* PDF Preview */}
                                  <div className="flex-1 overflow-auto">
                                    {pdfUrl && (
                                      <iframe src={pdfUrl} className="w-full h-full"></iframe>
                                    )}
                                  </div>
                          
                                  {/* Footer Buttons */}
                                  <div className="flex justify-between p-4 bg-gray-100">
                                    <button onClick={handleDownload} className="px-4 py-2 bg-purple-600 text-white rounded-md">
                                      Download PDF
                                    </button>
                                    <button onClick={() => setIsPreviewOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md">
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
  )
}

export default ExamMarkDetailsPage
