import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { FieldArray } from 'formik'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  capitalizeWords,
  feeduration,
} from '../../commonComponent/CommonFunctions'
import CustomCheckBox from '../../commonComponent/CustomCheckBox'
import CustomDate from '../../commonComponent/CustomDate'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'

function StudentFeeDetails({ values, setFieldValue, errors }) {
  const { selectedStudent, fees: allFees } = useSelector((state) => state.students);
  const { classes, sections } = useSelector((state) => state.students)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let dumpLIst = []
    allFees.forEach(item => {
      if (item.isGlobal || item.class?._id === values.academics.class) {
        let discount = 0
        dumpLIst.push({
          id: item._id,
          isChecked: false,
          feeName: item.name,
          feeType: '',
          dueDate: '',
          discount: discount,
          installmentAmount: item.amount - discount, //installment fee
          totalFee: item.amount * 1, //total fee
        })
      }
    })
    if (selectedStudent) {
      selectedStudent.fees.forEach(item => {
        let index = dumpLIst.findIndex(obj => obj.id === item.fees);
        if (index != -1) {
          dumpLIst[index].isChecked = true
          dumpLIst[index].feeType = item.feeType
          dumpLIst[index].dueDate = item.dueDate
          dumpLIst[index].discount = item.discount * 1
          dumpLIst[index].installmentAmount = item.amount * 1 - item.discount * 1 //installment fee
          dumpLIst[index].totalFee = item.amount * 1 //total fee
        }
      })
    }
    setFieldValue("fees", dumpLIst)

  }, [])

  const handleFeeChange = (e, index) => {
    let dumpLIst = values.fees
    if (e.target.name.includes('feeType')) {
      dumpLIst[index].feeType = e.target.value
    } else {
      let limit = values.fees[index].totalFee * 1 / 4
      if (e.target.value * 1 <= limit) {
        dumpLIst[index].discount = e.target.value
        dumpLIst[index].installmentAmount =
          values.fees[index].totalFee - e.target.value
      }
    }
    setFieldValue('fees', dumpLIst)
  }

  const getTotalFee = () => {
    return values.fees
      .filter((item) => item.isChecked)
      .reduce((acc, curr) => acc + curr.installmentAmount, 0)
  }

  const selectAllFees = () => {
    let dumpList = []
    values.fees.forEach((item) => {
      dumpList.push({
        ...item,
        isChecked: !checked,
      })
    })
    setFieldValue('fees', dumpList)
    setChecked(!checked)
  }

  const handleFeeChecked = (e, index) => {
    let dumpList = values.fees
    dumpList[index].isChecked = e.target.checked
    let isAllChecked = dumpList.every((item) => item.isChecked)
    setFieldValue('fees', dumpList)
    setChecked(isAllChecked)
  }

  const getClassName = () => {
    const cls = classes.filter(item => item.value === values.academics.class)
    return cls[0].label
  }

  const getSectionName = () => {
    const sec = sections.filter(item => item.value === values.academics.section)
    return sec[0].label
  }

  return (
    <>
      <div className="">
        <div className="pb-4 mb-4">
          <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
            Fee details
          </h2>
          <div className="rounded-md bg-purple-100 p-3 mb-4">
            <div className="flex">
              <div className="shrink-0">
                <InformationCircleIcon
                  aria-hidden="true"
                  className="size-5 text-purple-400"
                />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  {`Academic Fee Details - Class: ${getClassName()} - Sec - ${getSectionName()}`}
                </p>
              </div>
            </div>
          </div>
          {errors.fees && typeof errors.fees === 'string' && (
            <div className="text-red-500">{errors.fees}</div>
          )}

          <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
            <thead className="bg-purple-100">
              <tr>
                <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                  <CustomCheckBox
                    checked={checked}
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                    name="selectAll"
                    onChange={selectAllFees}
                  />
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                >
                  <a href="#" className="group inline-flex">
                    Fee Name
                  </a>
                </th>

                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                >
                  <a href="#" className="group inline-flex">
                    Duration
                  </a>
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                >
                  <a href="#" className="group inline-flex">
                    Discount
                  </a>
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                >
                  <a href="#" className="group inline-flex">
                    Due Date
                  </a>
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                >
                  <a href="#" className="group inline-flex">
                    Actual Amount
                  </a>
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                >
                  <a href="#" className="group inline-flex">
                    Amount After Discount
                  </a>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <FieldArray name="fees">
                {() =>
                  values.fees.map((item, index) => (
                    <tr key={item.id}>
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        <CustomCheckBox
                          name={item.feeName}
                          checked={item.isChecked}
                          onChange={(e) => handleFeeChecked(e, index)}
                        />
                      </td>

                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {capitalizeWords(item.feeName)}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        <CustomSelect
                          name={`fees.${index}.feeType`}
                          options={feeduration}
                          value={item.feeType}
                          onChange={(e) => handleFeeChange(e, index)}
                          disabled={!item.isChecked}
                          label="Duration"
                          isLabelRequired={false}
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                        <CustomInput
                          name={`fees.${index}.discount`}
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleFeeChange(e, index)}
                          disabled={!item.isChecked}
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                        <CustomDate
                          name={`fees.${index}.dueDate`}
                          value={item.dueDate}
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                        <CustomInput
                          name={`fees.${index}.totalFee`}
                          placeholder="Enter Total Fee"
                          type="number"
                          value={item.totalFee}
                          disabled
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                        <CustomInput
                          name={`fees.${index}.installmentAmount`}
                          type="number"
                          value={item.installmentAmount}
                          disabled
                        />
                      </td>
                    </tr>
                  ))
                }
              </FieldArray>
              <tr className="bg-purple-100">
                <td className="relative px-7 sm:w-12 sm:px-6"></td>

                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900">
                  Total Fee
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 max-w-10">
                  {getTotalFee()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default StudentFeeDetails
