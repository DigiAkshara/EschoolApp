import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaCloudUploadAlt } from "react-icons/fa";
import * as XLSX from "xlsx";
import React, { useState } from "react";
import { postData } from "../app/api";
import { STAFF, STUDENT } from "../app/url";
import { handleDownload, handleDownloadCSV } from "./CommonFunctions";

function CommonUpload({ onClose2, user }) {
  const [bulkUploadList, setBulkUploadList] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [duplicateHandlingOption, setDuplicateHandlingOption] = useState("skip"); 

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
    "AcademicYear",  
    "Class",          
    "Section",       
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

  const handleUpload = (event) => {
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

        console.log("Uploaded Data:", jsonData);

        let newData = [];
        const existingData = [...bulkUploadList];
       
        if (user === "student") {
          newData = jsonData.map((item) => ({
            firstName: item.FirstName || "",
            lastName: item.LastName || "",
            admissionNumber: item.AdmissionNo || "",
            class: item.Class || "",
            section: item.Section || "",
            DOB: item.DateOfBirth || "",
            aadharNumber: item.AadharNumber || "",
            gender: item.Gender || "",
            admissionDate:item.AdmissionDate || "",
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
            isSameAsPresent:false
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

        console.log(
          `Parsed ${user === "student" ? "Student" : "Staff"} Data:`,
          newData
        );

        const requiredFields =
        user === "student"
          ? ["firstName", "lastName", "admissionNumber",  "gender","fatherDetails.name","fatherDetails.mobileNumber","presentAddress.area","presentAddress.city","presentAddress.state","presentAddress.pincode","permanentAddress.area","permanentAddress.city","permanentAddress.state","permanentAddress.pincode","aadharNumber","DOB","class","section","admissionDate",]
          : ["firstName", "lastName", "empId", "DOJ", "DOB", "mobileNumber", "email", "workEmail","designation","subjects","guardian","gender","presentAddress.area","presentAddress.city","presentAddress.state","presentAddress.pincode","permanentAddress.area","permanentAddress.city","permanentAddress.state","permanentAddress.pincode","aadharNumber","panNumber","bankDetails.accountNumber","bankDetails.ifscCode","bankDetails.bankName","amount"];
       
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
          }else {
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
          console.error(
            `Invalid ${user === "student" ? "Student" : "Staff"} Data:`,
            invalidData
          );
          //   alert(`Some records are invalid. Check the console for details.`);
        } else {
          const uploadData  = async () => {
            try {
              const response = await postData(
                user === "student" ? STUDENT + "/bulk" : STAFF + "/bulk",
                updatedData
              );
              if (response?.status === 200) {
                alert("Data uploaded successfully!");
              }
            } catch (error) {
              console.error("Error while sending data to backend:", error);
              alert("An error occurred while uploading data.");
            }
          };
          uploadData ();
          setValidationError(`${user === "student" ? "Student" : "Staff"} list added successfully!`);
        }

        console.log(
          `Valid ${user === "student" ? "Student" : "Staff"} Data:`,
          updatedData
        );

        // setBulkUploadList([...existingData, ...validData]);
        setBulkUploadList(updatedData);
      };

      reader.readAsArrayBuffer(file);
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
              className="pointer-events-auto w-screen max-w-7xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
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
                        onClick={onClose2}
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

                  {/* Upload Section */}

                  {/* Upload Section */}
                  <div className="mt-4 border border-dashed border-gray-300 rounded-md p-6 text-center">
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".xls,.xlsx,.csv"
                      className="sr-only"
                      onChange={handleUpload}
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
                      How should duplicate entries be handled?{" "}
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
                    onClick={onClose2}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                  >
                    Next
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
