import {InformationCircleIcon} from '@heroicons/react/24/outline'
import {FieldArray, ErrorMessage} from 'formik'
import React, {useEffect, useState} from 'react'
import {getData} from '../../app/api'
import {FEES} from '../../app/url'
import {
  capitalizeWords,
  feeduration,
} from '../../commonComponent/CommonFunctions'
import CustomCheckBox from '../../commonComponent/CustomCheckBox'
import CustomDate from '../../commonComponent/CustomDate'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'

function StudentFeeDetails({values, setFieldValue,errors}) {
  const [checked, setChecked] = useState(false)
  const [fees, setFees] = useState([])
  const [classData, setClassData] = useState(null)

  const handleFeeChange = (e, index) => {
    let dumpLIst = values.feesData
    if (e.target.name.includes('duration')) {
      dumpLIst[index].duration = e.target.value
    } else {
      // let calAmount = calculateFees(values.feesData[index].duration*1, e.target.value*1, values.feesData[index].totalFee*1)
      dumpLIst[index].discount = e.target.value
      dumpLIst[index].installmentAmount =
        values.feesData[index].totalFee - e.target.value
    }
    setFieldValue('feesData', dumpLIst)
  }

  useEffect(() => {
    getfees()
  }, [])

  const getfees = async () => {
    const res = await getData(FEES + '/' + values.academicDetails.class)
    let dumpList = []
    res.data.data.forEach((item) => {
      let discount = 0
      dumpList.push({
        id: item._id,
        isChecked: false,
        feeName: item.name,
        duration: '',
        dueDate: '',
        discount: discount,
        installmentAmount: item.amount - discount, //installment fee
        totalFee: item.amount * 1, //total fee
      })
    })
    setClassData({
      ...res.data.data[0].class,
      section: values.academicDetails.section,
    })
    setFieldValue('feesData', dumpList)
    // setFees(res.data)
  }

  const getTotalFee = () => {
    return values.feesData
      .filter((item) => item.isChecked)
      .reduce((acc, curr) => acc + curr.installmentAmount, 0)
  }

  const selectAllFees = () => {
    let dumpList = []
    values.feesData.forEach((item) => {
      dumpList.push({
        ...item,
        isChecked: !checked,
      })
    })
    setFieldValue('feesData', dumpList)
    setChecked(!checked)
  }

  const handleFeeChecked = (e, index) => {
    let dumpList = values.feesData
    dumpList[index].isChecked = e.target.checked
    let isAllChecked = dumpList.every((item) => item.isChecked)
    setFieldValue('feesData', dumpList)
    setChecked(isAllChecked)
  }

  console.log(errors, values.feesData)

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
                  {`Academic Fee Details - Class: ${classData?.name} - Sec - ${classData?.section}`}
                </p>
              </div>
            </div>
          </div>
          {errors.feesData && typeof errors.feesData === 'string' && (
            <div className="text-red-500">{errors.feesData}</div>
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
                    Actual Fee
                  </a>
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                >
                  <a href="#" className="group inline-flex">
                    To Be Paid
                  </a>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <FieldArray name="feesData">
                {() =>
                  values.feesData.map((item, index) => (
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
                          name={`feesData.${index}.duration`}
                          options={feeduration}
                          value={item.duration}
                          onChange={(e) => handleFeeChange(e, index)}
                          disabled={!item.isChecked}
                          label="Duration"
                          isLabelRequired={false}
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                        <CustomInput
                          name={`feesData.${index}.discount`}
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleFeeChange(e, index)}
                          disabled={!item.isChecked}
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                        <CustomDate
                          name={`feesData.${index}.dueDate`}
                          value={item.dueDate}
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                        <CustomInput
                          name={`feesData.${index}.totalFee`}
                          placeholder="Enter Total Fee"
                          type="number"
                          value={item.totalFee}
                          disabled
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                        <CustomInput
                          name={`feesData.${index}.installmentAmount`}
                          type="number"
                          value={item.installmentAmount}
                          disabled
                        />
                      </td>
                    </tr>
                  ))
                }
              </FieldArray>
              {/* <tr>
                <td className="relative px-7 sm:w-12 sm:px-6"></td>

                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900">
                  Special Discount
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 max-w-10">
                  <CustomInput
                    name="specialDiscount"
                    type="number"
                    placeholder="Enter Special Discount"
                  />
                </td>
              </tr> */}
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
