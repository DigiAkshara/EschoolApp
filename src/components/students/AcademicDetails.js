import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getData, postData } from '../../app/api'
import { ACADEMIC_YEAR, UPLOAD } from '../../app/url'
import CustomDate from '../../commonComponent/CustomDate'
import CustomFileUploader from '../../commonComponent/CustomFileUploader'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'
import moment from 'moment'
import { handleApiResponse } from '../../commonComponent/CommonFunctions'

function StudentAcademicDetails({ values, setFieldValue }) {
  const { classes, sections } = useSelector((state) => state.students)
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
    getPrevAcademicYears()
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

  const getPrevAcademicYears = async() => {
    try {
      let res = await getData(ACADEMIC_YEAR + '/all')
      if (res.status === 200 || res.status === 201) {
        const curYear = moment().year()
        let list = []
        res.data.data.forEach(year => 
        {
          let end = year.year.split("-")[1].trim()
          if(end*1 < curYear*1){
            list.push({ label: year.year, value: year._id })
          }
        })
        setPrevAcademicOpts(list)
      } else {
        throw new Error(res)
      }
    } catch (error) {
      console.log(error)
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
            />
          </div>

          <div className="sm:col-span-2">
            <CustomDate
              name="admissionDate"
              label="Admission Date"
              required={true}
              maxDate={moment().format('YYYY-MM-DD')} 
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
              name="academics.class"
              label="Class"
              required={true}
              options={classes}
              onChange={(e) => {
                setFieldValue('academics.class', e.target.value)
                setFieldValue('academics.section', '')
              }}
            />
          </div>

          <div className="sm:col-span-1">
            <CustomSelect
              name="academics.section"
              label="Section"
              required={true}
              options={sections.filter(item => item.class == values.academics.class)}
              disabled={!values.academics.class}
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
