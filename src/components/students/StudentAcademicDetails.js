import React, {useEffect, useState} from 'react'
import {getData, postData} from '../../app/api'
import {ACADEMICYEAR, CLASSES, SECTIONS, UPLOAD} from '../../app/url'
import CustomDate from '../../commonComponent/CustomDate'
import CustomFileUploader from '../../commonComponent/CustomFileUploader'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'

function StudentAcademicDetails({values, setFieldValue}) {
  const [classes, setClasses] = useState([])
  const [academicYears, setAcademicYears] = useState([])
  const [sections, setSections] = useState([])
  useEffect(() => {
    getAcademicData()
  }, [])
  const getAcademicData = async () => {
    const [academicResponse, classResponse] = await Promise.all([
      getData(ACADEMICYEAR),
      getData(CLASSES),
    ])
    const classData = classResponse.data.data.map((item) => {
      return {
        label: item.name, // Displayed text in the dropdown
        value: item._id,
      }
    })
    const academicData = [
      {
        label: academicResponse.data.data.year, // Displayed text in the dropdown
        value: academicResponse.data.data._id,
      },
    ]
    setClasses(classData)
    setAcademicYears(academicData)
  }
  const handleFileChange = async (e) => {
    try {
      const formData = new FormData()
      formData.append('file', e.target.files[0])
      let response = await postData(UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.status === 200 || response.status === 201) {
        setFieldValue(e.target.name, response.data)
      } else {
        alert(response.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getSections = async (classId) => {
    const response = await getData(SECTIONS + '/' + classId)
    const sectionData = response.data.data.map((item) => {
      return {
        label: item.section, // Displayed text in the dropdown
        value: item._id,
      }
    })
    setFieldValue('academicDetails.class', classId)
    setSections(sectionData)
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
              name="academicDetails.academicYear"
              label="Academic year"
              options={academicYears}
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
              name="academicDetails.class"
              label="Class"
              required={true}
              options={classes}
              onChange={(e) => {
                getSections(e.target.value)
              }}
            />
          </div>

          <div className="sm:col-span-1">
            <CustomSelect
              name="academicDetails.section"
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
              options={academicYears}
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
  )
}

export default StudentAcademicDetails
