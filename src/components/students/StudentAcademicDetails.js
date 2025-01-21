import React, {useEffect, useState} from 'react'
import {getData, postData} from '../../app/api'
import {ACADEMIC_YEAR, CLASSES, FEES, SECTIONS, UPLOAD} from '../../app/url'
import CustomDate from '../../commonComponent/CustomDate'
import CustomFileUploader from '../../commonComponent/CustomFileUploader'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'
import { useSelector } from 'react-redux'

function StudentAcademicDetails({values, setFieldValue}) {
  const {classes, sections} = useSelector((state) => state.students)
  const academicYear = useSelector((state)=>state.appConfig.academicYear)
  const [academicYears, setAcademicYears] = useState([])

  useEffect(() => {
    setAcademicYears([{
      label: academicYear.year, // Displayed text in the dropdown
      value: academicYear._id,
    }])
  }, [academicYear])
  
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

  const getfees = async (classId) => {
    const res = await getData(FEES + '/' + classId)
    let dumpList = []
    res.data.data.forEach((item) => {
      let discount = 0
      dumpList.push({
        id: item._id,
        isChecked: false,
        feeName: item.name,
        feeType: '',
        dueDate: '',
        discount: discount,
        installmentAmount: item.amount - discount, //installment fee
        totalFee: item.amount * 1, //total fee
      })
    })
    setFieldValue('academicDetails.class', classId)
    setFieldValue('feesData', dumpList)
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
                getfees(e.target.value)
              }}
            />
          </div>

          <div className="sm:col-span-1">
            <CustomSelect
              name="academicDetails.section"
              label="Section"
              required={true}
              options={sections.filter(item=>item.class==values.academicDetails.class)}
              disabled = {!values.academicDetails.class}
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
