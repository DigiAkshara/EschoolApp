import React, { useEffect, useState } from 'react'
import { getData } from '../../app/api'
import { SUBJECTS } from '../../app/url'
import { capitalizeWords, designations, staffType } from '../../commonComponent/CommonFunctions'
import CustomDate from '../../commonComponent/CustomDate'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'
import MutliSelect from '../../commonComponent/MultiSelect'
function StaffInfo({ values, setFieldValue }) {
  const [subjects, setSubjects] = useState()

  useEffect(() => {
    getSubjects()
  }, [])

  const getSubjects = async () => {
    try{
      const res = await getData(SUBJECTS)
      const classData = res.data.data.map((item) => {
        return {
          label: capitalizeWords(item.name), // Displayed text in the dropdown
          value: item._id,
        }
      })
      setSubjects(classData)
    }catch(error){
      console.log(error)
    }
  }

  return (
    <>
      <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
          Staff Employment Details
        </h2>
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
            <CustomSelect
              name="staffType"
              label="Staff Type"
              options={staffType}
              required={true}
            />
          </div>
          <div className="sm:col-span-2">
            <CustomInput
              name="firstName"
              label="First Name"
              placeholder="Enter First Name"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="lastName"
              label="Last Name"
              placeholder="Enter last Name"
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="empId"
              label="Emp ID"
              placeholder="Enter EmpID"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomDate name="DOJ" label="Date Of Joining" required={true} />
          </div>




          <div className="sm:col-span-2">
            <CustomSelect
              name="designation"
              label="Designation"
              options={designations}
              required={true}
            />
          </div>


          <div className="sm:col-span-2">
            <CustomInput
              type="number"
              name="mobileNumber"
              label="Mobile Number"
              placeholder="Enter Mobile Number"
              required={true}
            />
          </div>
          <div className="sm:col-span-2">
            <CustomInput
              name="workEmail"
              label="Work Email"
              placeholder="Enter email"
            />
          </div>

          <div className="sm:col-span-2">
            <MutliSelect
              name="subjects"
              label="Dealing Subjects"
              options={subjects}
              required={values.staffType === 'teaching'}
              value={values.subjects}
              onChange={value => {
                setFieldValue('subjects', value ? value : [])
              }}
            />
          </div>

        </div>
      </div>
    </>
  )
}

export default StaffInfo
