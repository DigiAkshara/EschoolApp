import React, { useEffect, useState } from "react";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import CustomDate from "../commonComponent/CustomDate";
import CustomFileUploader from "../commonComponent/CustomFileUploader";
import { getAcademicYears } from "../commonComponent/CommonFunctions";
import { getData } from "../app/api";
import { CLASSES } from "../app/url";


function StudentAcademicDetails() {
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    getClasses();
  }, []);
  const getClasses = async () => {
    const res = await getData(CLASSES);
     const classData = res.data.data.map((item) => {
      return {
        label: item.name, // Displayed text in the dropdown
        value: item._id, 
      }
    })
    setClasses(classData);
  }
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
                options={getAcademicYears()}
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
                options={classes}
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
                options={getAcademicYears()}
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
