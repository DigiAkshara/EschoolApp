import React, { useEffect, useState } from "react";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import CustomDate from "../commonComponent/CustomDate";
import CustomFileUploader from "../commonComponent/CustomFileUploader";
import { getAcademicYears, sections } from "../commonComponent/CommonFunctions";
import { getData, postData } from "../app/api";
import { CLASSES, UPLOAD } from "../app/url";


function StudentAcademicDetails({values, setFieldValue}) {
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
  const handleFileChange = async (e) => {
      try {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        let response = await postData(UPLOAD, formData, {headers: {
          'Content-Type': 'multipart/form-data',
        }});
        if (response.status === 200 || response.status === 201) {
          setFieldValue(e.target.name, response.data);
        } else {
          alert(response.message);
        }
      } catch (error) {
        console.log(error);
      }
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
                name="acadamicDetails.acadamicYear"
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
                name="acadamicDetails.class"
                label="Class"
                required={true}
                options={classes}
              />
            </div>

            <div className="sm:col-span-1">
              <CustomSelect
                name="acadamicDetails.section"
                label="Section"
                required={true}
                options={sections}
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
                name="previousSchool.yearOfStudy"
                label="Year of study"
                options={getAcademicYears()}
              />
            </div>

            <div className="sm:col-span-2">
              <CustomInput
                name="previousSchool.schoolName"
                label="School Name"
                placeholder="Enter"
              />
            </div>

            <div className="sm:col-span-2">
              <CustomInput
                name="previousSchool.classStudied"
                label="Class"
                placeholder="Enter Class"
              />
            </div>

            <div className="sm:col-span-2">
              <CustomInput
                name="previousSchool.totalMarks"
                label="Total Marks Scored"
                placeholder="Enter"
              />
            </div>
            <div className="sm:col-span-4">
        <div className="mt-2">
          <CustomFileUploader
            name="previousSchool.studyProof"
            label="Upload Transfer / Study Certificate"
            onChange={handleFileChange}
          />
        
        </div>
       
      </div>

          </div>
        </div>

      </div>

  );
}

export default StudentAcademicDetails;
