import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaCloudUploadAlt } from "react-icons/fa";
import * as XLSX from "xlsx";
import React, { useEffect, useRef, useState } from "react";
import { postData } from "../app/api";
import { STAFF, STUDENT } from "../app/url";
import { capitalizeWords, handleApiResponse, handleDownload, handleDownloadCSV } from "./CommonFunctions";
import { useSelector } from "react-redux";
import moment from "moment";

function CommonUpload({ onClose, user, loadData = () => { } }) {
  let fileInputRef = useRef();
  const { classes, sections, boards } = useSelector((state) => state.students)
  const { academicYears } = useSelector((state) => state.appConfig)
  const [bulkUploadList, setBulkUploadList] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [duplicateHandlingOption, setDuplicateHandlingOption] = useState("skip");
  const [classValue, setClassValue] = useState("");
  const [sectionValue, setSectionValue] = useState("");
  const [academicYearValue, setAcademicYearValue] = useState("");
  const [boardValue, setBoardValue] = useState("");

  useEffect(() => {
    if (academicYears.length > 0) {
      let activeYear = academicYears.find((item) => item.status === 'active')
      if(activeYear) {
        setAcademicYearValue(activeYear._id)
      }
    }
  }, [academicYears]);

  useEffect(() => {
    if (classes.length > 0 && sections.length > 0) {
      const classId = classes[0].value;
      setClassValue(classId)
      setSectionValue(sections.filter((sec) => sec.class === classId)[0]?.value);
    }
    if (boards.length > 0) {
      setBoardValue(boards[0].value);
    }
  }, [classes, sections, boards]);

  const csvHeadersStudent = [
    "FirstName",
    "LastName",
    "AdmissionNo",
    "DateOfBirth",
    "AadharNumber",
    "Gender",
    "FatherName",
    "FatherMobile",
    "FatherOccupation",
    "FatherEmail",
    "Nationality",
    "Religion",
    "Cast",
    "SubCast",
    "BloodGroup",
    "MotherName",
    "MotherMobile",
    "MotherOccupation",
    "MotherEmail",
    "ParentIdProof",
    "AdmissionDate",
    "PresentArea",
    "PresentCity",
    "PresentState",
    "PresentPincode",
    "PermanentArea",
    "PermanentCity",
    "PermanentState",
    "PermanentPincode",
    "PreviousSchoolName",
    "PreviousSchoolYearOfStudy",
    "PreviousClassStudiedYear"
  ];


  const csvHeadersStaff = [
    "FirstName",
    "LastName",
    "EmpId",
    "WorkEmail",
    "Designation",
    "StaffType",
    "Subjects",
    "AadharNumber",
    "Gender",
    "DOJ",
    "MobileNumber",
    "ProfilePic",
    "Email",
    "Guardian",
    "DOB",
    "PresentArea",
    "PresentCity",
    "PresentState",
    "PresentPincode",
    "PermanentArea",
    "PermanentCity",
    "PermanentState",
    "PermanentPincode",
    "PanNumber",
    "AadharPic",
    "PanCardPic",
    "AccountNumber",
    "IfscCode",
    "BankName",
    "PassBookPic",
    "Amount",
  ];


  const downloadSampleCSV = () => {
    if (user === "student") {
      handleDownloadCSV(csvHeadersStudent, "sample-student-data.csv");
    } else if (user === "staff") {
      handleDownloadCSV(csvHeadersStaff, "sample-staff-data.csv");
    }
  };

  const downloadSampleXLS = () => {
    if (user === "student") {
      handleDownload(csvHeadersStudent, "sample-student-data");
    } else if (user === "staff") {
      handleDownload(csvHeadersStaff, "sample-staff-data");
    }
  };

  const excelDateToJSDate = (serial) => {
    const utcDays = Math.floor(serial - 25569);
    const jsDate = new Date(utcDays * 86400 * 1000);
    return moment(jsDate).format('YYYY-MM-DD');
  };

  const clearFileInput = () => {
    fileInputRef.current.value = null;
  }

  const handleUpload = (event) => {
    setBulkUploadList([]);
    setValidationError("");
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet contains the data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        let newData = [];
        const existingData = [...bulkUploadList];

        if (user === "student") {
          newData = jsonData.map((item) => ({
            firstName: item.FirstName || "",
            lastName: item.LastName || "",
            admissionNumber: item.AdmissionNo || "",
            DOB: excelDateToJSDate(item.DateOfBirth) || "",
            aadharNumber: item.AadharNumber || "",
            gender: item.Gender.toLowerCase() || "",
            board: boardValue,
            class: classValue,
            section: sectionValue,
            academicYear: academicYearValue,
            admissionDate: excelDateToJSDate(item.AdmissionDate) || "",
            fatherDetails: {
              email: item.FatherEmail || "",
              mobileNumber: item.FatherMobile || "",
              name: item.FatherName || "",
              occupation: item.FatherOccupation || "",
            },
            motherDetails: {
              email: item.MotherEmail || "",
              mobileNumber: item.MotherMobile || "",
              name: item.MotherName || "",
              occupation: item.MotherOccupation || "",
            },
            nationality: item.Nationality || "",
            religion: item.Religion || "",
            cast: item.Cast || "",
            subCast: item.SubCast || "",
            presentAddress: {
              area: item.PresentArea || "",
              city: item.PresentCity || "",
              pincode: item.PresentPincode || "",
              state: item.PresentState || "",
            },
            permanentAddress: {
              area: item.PermanentArea || "",
              city: item.PermanentCity || "",
              pincode: item.PermanentPincode || "",
              state: item.PermanentState || "",
            },
            isSameAsPresent: false
          }));
        } else if (user === "staff") {
          newData = jsonData.map((item) => ({
            firstName: item.FirstName || "",
            lastName: item.LastName || "",
            empId: item.EmpId || "",
            DOJ: item.DOJ || "",
            DOB: item.DOB || "",
            mobileNumber: item.MobileNumber || "",
            email: item.Email || "",
            workEmail: item.WorkEmail || "",
            gender: item.Gender || "",
            designation: item.Designation || "",
            staffType: item.StaffType || "",
            subjects: item.Subjects || "",
            guardian: item.Guardian || "",
            permanentAddress: {
              area: item.PermanentArea || "",
              city: item.PermanentCity || "",
              state: item.PermanentState || "",
              pincode: item.PermanentPincode || "",
            },
            presentAddress: {
              area: item.PresentArea || "",
              city: item.PresentCity || "",
              state: item.PresentState || "",
              pincode: item.PresentPincode || "",
            },
            aadharNumber: item.AadharNumber || "",
            aadharPic: item.AadharPic || "",
            panNumber: item.PanNumber || "",
            bankDetails: {
              accountNumber: item.AccountNumber || "",
              ifscCode: item.IfscCode || "",
              bankName: item.BankName || "",

            },
            amount: item.Amount || "",
          }));
        }

        // Parse and map the data
        const requiredFields =
          user === "student"
            ? ["firstName", "lastName", "admissionNumber", "gender", "fatherDetails.name", "fatherDetails.mobileNumber", "presentAddress.area", "presentAddress.city", "presentAddress.state", "presentAddress.pincode", "permanentAddress.area", "permanentAddress.city", "permanentAddress.state", "permanentAddress.pincode", "aadharNumber", "DOB", "admissionDate", "class", "section", "academicYear", "board"]
            : ["firstName", "lastName", "empId", "DOJ", "DOB", "mobileNumber", "email", "workEmail", "designation", "subjects", "guardian", "gender", "presentAddress.area", "presentAddress.city", "presentAddress.state", "presentAddress.pincode", "permanentAddress.area", "permanentAddress.city", "permanentAddress.state", "permanentAddress.pincode", "aadharNumber", "panNumber", "bankDetails.accountNumber", "bankDetails.ifscCode", "bankDetails.bankName", "amount"];

        const invalidData = [];
        const updatedData = [...existingData];

        newData.forEach((item) => {
          const missingFields = requiredFields.filter((field) => {
            const keys = field.split(".");
            const value = keys.reduce((acc, key) => acc && acc[key], item);
            return !value;
          });
          if (missingFields.length > 0) {
            invalidData.push({
              ...item,
              missingFields: `Missing fields: ${missingFields.join(", ")}`,
            });
          } else {
            const idField = user === "student" ? "admissionNumber" : "empId";
            const duplicateIndex = updatedData.findIndex(
              (existing) => existing[idField] === item[idField]
            );

            if (duplicateIndex !== -1) {
              if (duplicateHandlingOption === "overwrite") {
                updatedData[duplicateIndex] = item; // Overwrite existing entry
              }
              // If "skip", do nothing (skip the entry)
            } else {
              updatedData.push(item); // Add new entry
            }
          }
        });

        if (invalidData.length > 0) {
          setValidationError("Failed uploading - Please add all required fields for all students.");
          if (user === "student") {
            if (boardValue === "" || classValue === "" || sectionValue === "") {
              setValidationError("Missing board, class or section. Please select them before uploading the file.");
            }
          }
          console.log(
            `Invalid ${user === "student" ? "Student" : "Staff"} Data:`,
            invalidData
          );
        } else {
          setValidationError(`${user === "student" ? "Student" : "Staff"} list uploaded successfully!`);
        }
        setBulkUploadList(updatedData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async () => {
    if (bulkUploadList.length > 0) {
      try {
        const res = await postData(
          user === "student" ? STUDENT + "/bulk" : STAFF + "/bulk",
          bulkUploadList
        );
        handleApiResponse(res.data.message, "success");
        loadData()
        onClose()
      } catch (error) {
        handleApiResponse(error);
      }finally {
        setBulkUploadList([]);
      }
    } else {
      setValidationError("Please upload a file first.");
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
                {/* Header */}
                <div className="bg-purple-900 px-3 py-3 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-base font-semibold text-white">
                      Upload File
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

                {/* Content */}
                <div className="relative flex-1 px-6 py-6 sm:px-6 overflow-y-auto">
                  <div className="mb-4 border-b border-gray-900/10 ">
                    {user === "student" ? (
                      <h1>Upload Student List - Select File</h1>
                    ) : (
                      <h1>Upload Staff List - Select File</h1>
                    )}
                  </div>
                  {/* Download Section */}
                  <div>
                    <p className="text-sm text-gray-500">
                      Download a sample{" "}
                      <a href="javascript:void(0);" className="text-blue-600 underline" onClick={downloadSampleCSV}>
                        .csv format
                      </a>{" "}
                      or{" "}
                      <a href="javascript:void(0);" className="text-blue-600 underline" onClick={downloadSampleXLS}>
                        .xls format
                      </a>{" "}
                      file and compare it with your import file to ensure that
                      the file is ready to import.
                    </p>
                  </div>

                  {/* Class and Section */}
                  {user === "student" && (
                    <div className='mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8'>
                      <div className="sm:col-span-2">
                        <label htmlFor="academicYear" className="block text-sm/6 font-regular text-gray-900">
                          Academic Year <span className="pl-1 text-red-500">*</span>
                        </label>
                        <select
                          // disabled
                          onChange={(e) => {
                            setAcademicYearValue(e.target.value);
                            clearFileInput()
                            setValidationError("")
                          }}
                          value={academicYearValue}
                          id="academicYear"
                          name="academicYear"
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                        >

                          {academicYears.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.year}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="class" className="block text-sm/6 font-regular text-gray-900">
                          Board <span className="pl-1 text-red-500">*</span>
                        </label>
                        <select
                          value={boardValue}
                          onChange={(e) => {
                            setBoardValue(e.target.value);
                            clearFileInput()
                            setValidationError("")
                          }}
                          id="class"
                          name="class"
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                        >
                          <option value="">Select Board</option>
                          {boards.map((item) => (
                            <option key={item.value} value={item.value}>
                              {capitalizeWords(item.label)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="class" className="block text-sm/6 font-regular text-gray-900">
                          Class <span className="pl-1 text-red-500">*</span>
                        </label>
                        <select
                          value={classValue}
                          onChange={(e) => {
                            setClassValue(e.target.value);
                            setSectionValue("");
                            setValidationError("")
                            clearFileInput()
                          }}
                          id="class"
                          name="class"
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                        >
                          <option value="">Select Class</option>
                          {classes.map((item) => (
                            <option key={item.value} value={item.value}>
                              {capitalizeWords(item.label)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="section" className="block text-sm/6 font-regular text-gray-900">
                          Section <span className="pl-1 text-red-500">*</span>
                        </label>
                        <select
                          value={sectionValue}
                          onChange={(e) => {
                            setSectionValue(e.target.value);
                            setValidationError("")
                            clearFileInput()
                          }}
                          id="section"
                          name="section"
                          disabled={!classValue}
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                        >
                          <option value="">Select Section</option>
                          {sections.filter((item) => item.class === classValue).map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>)}

                  {/* Upload Section */}
                  <div className="mt-4 border border-dashed border-gray-300 rounded-md p-6 text-center">
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".xls,.xlsx,.csv"
                      className="sr-only"
                      onChange={handleUpload}
                    // disabled={classValue && sectionValue ? false : true}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <FaCloudUploadAlt className="text-4xl text-purple-600 mb-2" />

                      <p className="text-sm font-medium text-gray-600">
                        Drop files here or click to upload
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        Maximum File Size: 5 MB | File Format: .xls, .xlsx, .csv
                      </p>
                    </label>
                    {validationError && (
                      <p style={{ color: "red", fontWeight: "bold" }}>
                        {validationError}
                      </p>
                    )}
                  </div>

                  {/* Duplicate Entries */}

                  <div className="mt-5 sm:col-span-4">
                    <label className="block text-sm  text-gray-700">
                      How should duplicate entries to be handled?{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <fieldset className="mt-2">
                      <legend className="sr-only">
                        Duplicate handling options
                      </legend>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            id="skip"
                            name="duplicate-handling"
                            type="radio"
                            value="skip"
                            onChange={(e) => setDuplicateHandlingOption(e.target.value)}
                            defaultChecked
                            className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label
                            htmlFor="skip"
                            className="ml-3 block text-sm  text-gray-700"
                          >
                            Skip
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="overwrite"
                            name="duplicate-handling"
                            type="radio"
                            value="overwrite"
                            onChange={(e) => setDuplicateHandlingOption(e.target.value)}
                            className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label
                            htmlFor="overwrite"
                            className="ml-3 block text-sm  text-gray-700"
                          >
                            Overwrite
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 px-4 py-4 bg-gray-100 w-full justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommonUpload;
