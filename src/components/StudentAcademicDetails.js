import React, { useState } from "react";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import CustomDate from "../commonComponent/CustomDate";
import CustomFileUploader from "../commonComponent/CustomFileUploader";


function StudentAcademicDetails() {
  return (
      <div className="">
        <div className="border-b border-gray-900/10 pb-4 mb-4">
          <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
            Present Academic Details
          </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
            <div className="sm:col-span-2">
              <CustomSelect
                name="academicYear"
                label="Academic year"
                options={[
                  { value: "2023", label: "2023" },
                  { value: "2024", label: "2024" },
                  { value: "2025", label: "2025" },
                ]}
                required={true}
              />
            </div>

            <div className="sm:col-span-2">
                <CustomDate
                  name="admissionDate"
                  label="Admission Date"
                  required={true}
                  />
            </div>

            <div className="sm:col-span-2">
              <CustomInput
                name="admissionNumber"
                label="Admission Number"
                placeholder="Enter Admi.No."
                required={true}
              />
            </div>

            <div className="sm:col-span-1">
              <CustomSelect
                name="class"
                label="Class"
                required={true}
                options={[
                  { value: "", label: "Select Class" },
                  { value: "1", label: "Class 1" },
                  { value: "2", label: "Class 2" },
                  { value: "3", label: "Class 3" },
                ]}
              />
            </div>

            <div className="sm:col-span-1">
              <CustomSelect
                name="section"
                label="Section"
                required={true}
                options={[
                  { value: "A", label: "Section A" },
                  { value: "B", label: "Section B" },
                  { value: "C", label: "Section C" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-4 mb-4">
          <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
            Previous Academic Details
          </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
            <div className="sm:col-span-2">
              <CustomSelect
                id="yearOfStudy"
                name="yearOfStudy"
                label="Year of study"
                options={[
                  { value: "", label: "Select Year" },
                  { value: "2020", label: "2020" },
                  { value: "2021", label: "2021" },
                  { value: "2022", label: "2022" },
                ]}
              />
            </div>

            <div className="sm:col-span-2">
              <CustomInput
                name="schoolName"
                label="School Name"
                placeholder="Enter"
              />
            </div>

            <div className="sm:col-span-2">
              <CustomInput
                name="className"
                label="Class"
                placeholder="Enter Class"
              />
            </div>

            <div className="sm:col-span-2">
              <CustomInput
                name="totalMarks"
                label="Total Marks Scored"
                placeholder="Enter"
              />
            </div>
            <div className="sm:col-span-4">
        <div className="mt-2">
          <CustomFileUploader
            name="certificateUpload"
            label="Upload Transfer / Study Certificate"
            required={true}
          />
        
        </div>
       
      </div>

          </div>
        </div>

      </div>

  );
}

export default StudentAcademicDetails;
