import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { FieldArray } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  capitalizeWords,
  feeduration,
  handleApiResponse,
} from '../../commonComponent/CommonFunctions'
import CustomCheckBox from '../../commonComponent/CustomCheckBox'
import CustomDate from '../../commonComponent/CustomDate'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'
import moment from 'moment'
import { getData } from '../../app/api'
import { FEES, STOPS } from '../../app/url'
import { updateFees } from '../../app/reducers/studentSlice'

function StudentFeeDetails({ values, setFieldValue, errors }) {
  const dispatch = useDispatch()
  const { selectedStudent, fees: allFees } = useSelector((state) => state.students);
  const { classes, sections } = useSelector((state) => state.students)
  const [checked, setChecked] = useState(false)
  const [busRoutes, setBusRoutes] = useState([])
  const [busRouteOpts, setBusRouteOpts] = useState([])

  const getBusRoutes = async () => {
    try {
      let res = await getData(STOPS)
      let routes = res.data.data.map((item) => ({
        value: item._id,
        label: `${item.name} - ${item.route.name}`,
      }))
      setBusRoutes(res.data.data)
      setBusRouteOpts(routes)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const getFees = async () => {
    try {
      let res = await getData(FEES)
      dispatch(updateFees(res.data.data))
    } catch (error) {
      handleApiResponse(error)
    }
  }

  useEffect(() => {
    getFees(FEES)
    getBusRoutes()
  }, [])

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
          dueDate: null,
          discount: discount,
          installmentAmount: item.amount - discount, //installment fee
          totalFee: item.amount * 1, //total fee
        })
      }
    })
    if (selectedStudent) {
      selectedStudent.fees?.feeList.forEach(item => {
        let index = dumpLIst.findIndex(obj => obj.id === item.fee._id);
        const discount = item.discount || 0
        if (index != -1) {
          dumpLIst[index].isChecked = true
          dumpLIst[index].feeType = item.duration
          dumpLIst[index].dueDate = item.dueDate
          dumpLIst[index].discount = discount * 1
          if (item.fee.name === 'Bus Fee') {
            dumpLIst[index].totalFee = item.paybalAmount * 1 + discount * 1 //installment fee
            dumpLIst[index].installmentAmount = item.paybalAmount * 1
          } else {
            dumpLIst[index].totalFee = item.fee.amount * 1 //total fee
            dumpLIst[index].installmentAmount = item.fee.amount * 1 - discount * 1 //installment fee
          }
        }
      })
    }
    setFieldValue("fees", dumpLIst)
  }, [allFees])

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
    dumpList[index].feeType = ''
    dumpList[index].discount = 0
    dumpList[index].dueDate = null
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

  const isExistingFee = (id) => {
    let isDisabled = false
    const index = selectedStudent?.fees?.feeList.findIndex((item) => item.fee._id === id)
    if (index&&index !== -1) {
      isDisabled = values._id ? true : false
    }
    return isDisabled
  }

  const isSelectedBusFee = () => {
    let isBusFee = false
    values.fees.forEach((item) => {
      if (item.feeName === 'Bus Fee' && item.isChecked) {
        isBusFee = true
      }
    })
    return isBusFee
  }

  const disableRouteField = () => {
    let isDisabled = false
    let index = selectedStudent?.fees?.feeList.findIndex((item) => item.fee.name === 'Bus Fee')
    if (index&&index !== -1 && isSelectedBusFee() && values._id) {
      isDisabled = true
    }
    return isDisabled
  }

  const handleRouteChange = (e) => {
    let dumpList = values.fees
    const index = dumpList.findIndex((item) => item.feeName === 'Bus Fee')
    const selectedRoute = busRoutes.find((item) => item._id === e.target.value)
    if (selectedRoute) {
      dumpList[index].discount = 0
      dumpList[index].totalFee = selectedRoute?.amount || 0
      dumpList[index].installmentAmount = selectedRoute.amount * 1 || 0
      setFieldValue('fees', dumpList)
    }
    setFieldValue('busRoute', e.target.value)
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
                    disabled={values._id ? true : false}
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
                          disabled={isExistingFee(item.id)}
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
                          disabled={!item.isChecked || isExistingFee(item.id)}
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
                          disabled={!item.isChecked || isExistingFee(item.id)}
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                        <CustomDate
                          name={`fees.${index}.dueDate`}
                          value={item.dueDate}
                          minDate={moment().format('MM-DD-YYYY')}
                          disabled={!item.isChecked ||isExistingFee(item.id)}
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
                          value={item.isChecked ? item.installmentAmount : ''}
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

          {isSelectedBusFee() && (
            <div className="border-b border-gray-900/10 pb-4 mb-4 mt-4">
              <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                Bus Stop Details
              </h2>
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
                <div className="sm:col-span-2">
                  <CustomSelect
                    name="busRoute"
                    options={busRouteOpts}
                    value={values.busRoute}
                    label="Bus Route"
                    required={true}
                    onChange={handleRouteChange}
                    disabled={disableRouteField()}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default StudentFeeDetails
