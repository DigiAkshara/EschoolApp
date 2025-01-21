import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaCloudUploadAlt } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React, { useState } from "react";

function CommonUpload({ onClose2, user }) {
  const [bulkUploadList, setBulkUploadList] = useState([]);

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
        let existingData = bulkUploadList;

        if (user === "student") {
          newData = jsonData.map((item) => ({
            name: item.name || "",
            admissionNumber: item.admissionNo || "",
            class: item.className || "",
            section: item.sectionName || "",
            DOB: item.dateOfBirth || "",
            aadharNumber: item.aadharNumber || "",
            gender: item.gender || "",
            fatherDetails: {
              email: item.fatherEmail || "",
              mobileNumber: item.fatherMobile || "",
              name: item.fatherName || "",
              occupation: item.fatherOccupation || "",
            },
            motherDetails: {
              email: item.motherEmail || "",
              mobileNumber: item.motherMobile || "",
              name: item.motherName || "",
              occupation: item.motherOccupation || "",
            },
            nationality: item.nationality || "",
            religion: item.religion || "",
            cast: item.cast || "",
            subCast: item.subCast || "",
            presentAddress: {
              area: item.area || "",
              city: item.city || "",
              pincode: item.pincode || "",
              state: item.state || "",
            },
            permanentAddress: {
              area: item.permanentArea || "",
              city: item.permanentCity || "",
              pincode: item.permanentPin || "",
              state: item.permanentState || "",
            },
          }));
        } else if (user === "staff") {
          newData = jsonData.map((item) => ({
            firstName: item.firstName || "",
            lastName: item.lastName || "",
            empId: item.staffId || "",
            DOJ: item.DOJ || "",
            DOB: item.DOB || "",
            mobileNumber: item.mobileNumber || "",
            email: item.email || "",
            workEmail: item.workEmail || "",
            gender: item.gender || "",
            designation: item.designation || "",
            staffType: item.staffType || "",
            subjects: item.subjects || "",
            guardian: item.guardian || "",
            permanentAddress: {
              area: item.permanentArea || "",
              city: item.permanentCity || "",
              state: item.permanentState || "",
              pincode: item.permanentPin || "",
            },
            presentAddress: {
              area: item.presentArea || "",
              city: item.presentCity || "",
              state: item.presentState || "",
              pincode: item.presentPin || "",
            },
            aadharNumber: item.aadharNumber || "",
            aadharPic: item.aadharPic || "",
            panNumber: item.panNumber || "",
            bankDetails: {
              accountNumber: item.accountNumber || "",
              ifscCode: item.ifscCode || "",
              bankName: item.bankName || "",
            },
            amount: item.salary || "",
          }));
        }

        // Parse and map the data

        console.log(
          `Parsed ${user === "student" ? "Student" : "Staff"} Data:`,
          newData
        );

        const requiredFields =
          user === "student"
            ? ["name", "admissionNumber", "class", "section"]
            : [
                "firstName",
                "lastName",
                "empId",
                "workEmail",
                "designation",
                "email",
              ];

        // Validation logic
        const existingIds =
          user === "student"
            ? existingData.map((student) => student.admissionNumber)
            : existingData.map((staff) => staff.empId);
        // const existingAdmissionNumbers = bulkUploadList.map((student) => student.admissionNumber); // Existing student data

        const validData = [];
        const invalidData = [];

        newData.forEach((item) => {
          const missingFields = requiredFields.filter((field) => !item[field]);

          if (missingFields.length > 0) {
            invalidData.push({
              ...item,
              missingFields: `Missing fields: ${missingFields.join(", ")}`,
            });
          } else {
            const existingIndex = existingIds.findIndex(
              (id) =>
                id === (user === "student" ? item.admissionNumber : item.empId)
            );

            if (existingIndex !== -1) {
              const duplicateHandling = document.querySelector(
                'input[name="duplicate-handling"]:checked'
              )?.value;

              if (duplicateHandling === "overwrite") {
                const updatedList = [...existingData];
                updatedList[existingIndex] = item;
                setBulkUploadList(updatedList);
              } else if (duplicateHandling === "skip") {
                console.warn(
                  `Skipped duplicate record for ${
                    user === "student" ? "admissionNumber" : "empId"
                  }: ${item[user === "student" ? "admissionNumber" : "empId"]}`
                );
              }
            } else {
              validData.push(item);
            }
          }
        });

        if (invalidData.length > 0) {
          console.error(
            `Invalid ${user === "student" ? "Student" : "Staff"} Data:`,
            invalidData
          );
          alert(`Some records are invalid. Check the console for details.`);
        }

        console.log(
          `Valid ${user === "student" ? "Student" : "Staff"} Data:`,
          validData
        );

        setBulkUploadList([...existingData, ...validData]);
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
                      <a href="#" className="text-blue-600 underline">
                        .csv format
                      </a>{" "}
                      or{" "}
                      <a href="#" className="text-blue-600 underline">
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
