import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { postData } from '../../app/api'
import { UPLOAD } from '../../app/url'
import { generateYearRanges, handleApiResponse } from '../../commonComponent/CommonFunctions'
import CustomDate from '../../commonComponent/CustomDate'
import CustomFileUploader from '../../commonComponent/CustomFileUploader'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'

function StudentAcademicDetails({ values, setFieldValue }) {
  const { classes, sections, boards } = useSelector((state) => state.students)
  const academicYear = useSelector((state) => state.appConfig.academicYear)
  const [academicYears, setAcademicYears] = useState([])
  const [prevAcademicOpts, setPrevAcademicOpts] = useState([])

  useEffect(() => {
    setAcademicYears([{
      label: academicYear.year, // Displayed text in the dropdown
      value: academicYear._id,
    }])
  }, [academicYear])

  useEffect(() => {
    const years = generateYearRanges(3)
    setPrevAcademicOpts(years)
  }, [])

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
      handleApiResponse(error)
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
              name="academics.academicYear"
              label="Academic year"
              options={academicYears}
              required={true}
              disabled={values._id ? true : false}
            />
          </div>
          <div className="sm:col-span-2">
            <CustomSelect
              name="academics.board"
              label="Board"
              options={boards}
              required={true}
              disabled={values._id ? true : false}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomDate
              name="admissionDate"
              label="Admission Date"
              required={true}
              maxDate={moment().format('YYYY-MM-DD')}
              disabled={values._id ? true : false}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="admissionNumber"
              label="Admission Number"
              placeholder="Enter Admi.No."
              required={true}
              disabled={values._id ? true : false}
            />
          </div>

          <div className="sm:col-span-1">
            <CustomSelect
              name="academics.class"
              label="Class"
              required={true}
              options={classes}
              onChange={(e) => {
                setFieldValue('academics.class', e.target.value)
                setFieldValue('academics.section', '')
              }}
              disabled={values._id ? true : false}
            />
          </div>

          <div className="sm:col-span-1">
            <CustomSelect
              name="academics.section"
              label="Section"
              required={true}
              options={sections.filter(item => item.class._id == values.academics.class)}
              disabled={!values.academics.class || (values._id ? true : false)}
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
              options={prevAcademicOpts}
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
